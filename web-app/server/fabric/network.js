'use strict';
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const USER_ROLES = require('../configs/constant').USER_ROLES;

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect database
mongoose.connect(
  process.env.MONGODB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error) => {
    if (error) console.log(error);
    else console.log('connection successful');
  }
);
mongoose.set('useCreateIndex', true);

exports.connectToNetwork = async function(user, cli = false) {
  try {
    let orgMSP = 'student';

    if (user.role == USER_ROLES.ADMIN_ACADEMY || user.role == USER_ROLES.TEACHER) {
      orgMSP = 'academy';
    } else if (user.role == USER_ROLES.ADMIN_STUDENT || user.role == USER_ROLES.STUDENT) {
      orgMSP = 'student';
    } else {
      let response = {};
      response.error =
        'An identity for the user ' +
        username +
        ' does not exist in the wallet. Register ' +
        username +
        ' first';
      return response;
    }

    const ccpPath = path.resolve('../../..', 'certificate-network', `connection-${orgMSP}.json`);
    let walletPath = path.join(process.cwd(), `/wallet-${orgMSP}`);

    // if (cli) {
    //   walletPath = path.join(process.cwd(), `wallet-${orgMSP}`);
    // }
    console.log(ccpPath);

    const wallet = new FileSystemWallet(walletPath);
    //const userExists = await wallet.exists(user.username);
    const userExists = true;

    let networkObj;

    if (!userExists) {
      let response = {};
      response.error =
        'An identity for the user ' +
        username +
        ' does not exist in the wallet. Register ' +
        username +
        ' first';
      return response;
    } else {
      const gateway = new Gateway();
      console.log(user.username);

      await gateway.connect(ccpPath, {
        wallet: wallet,
        identity: user.username,
        discovery: { enabled: true, asLocalhost: true }
      });

      const network = await gateway.getNetwork('certificatechannel');
      const contract = await network.getContract('academy');

      networkObj = {
        contract: contract,
        network: network,
        gateway: gateway,
        user: user
      };
      console.log(networkObj);
    }

    return networkObj;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
};

exports.query = async function(networkObj, func, args) {
  try {
    if (Array.isArray(args)) {
      let response = await networkObj.contract.evaluateTransaction(func, ...args);
    } else if (args) {
      let response = await networkObj.contract.evaluateTransaction(func, args);

      await networkObj.gateway.disconnect();
      return response;
    } else {
      let response = await networkObj.contract.evaluateTransaction(func);

      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    return error;
  }
};

exports.createSubject = async function(networkObj, subjectID, name, teacherUsername) {
  try {
    let response = await networkObj.contract.submitTransaction(
      'CreateSubject',
      subjectID,
      name,
      teacherUsername
    );
    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.createScore = async function(networkObj, subjectID, studentUsername, score) {
  try {
    let response = await networkObj.contract.submitTransaction(
      'CreateScore',
      subjectID,
      studentUsername,
      score
    );
    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.createCertificate = async function(networkObj, certificate) {
  try {
    let response = await networkObj.contract.submitTransaction(
      'CreateCertificate',
      certificate.certificateID,
      certificate.subjectID,
      certificate.studentUsername,
      certificate.issueDate
    );

    await networkObj.gateway.disconnect();
    return response;
  } catch (error) {
    return error;
  }
};

exports.registerTeacherOnBlockchain = async function(networkObj, createdUser) {
  if (!createdUser.username || createdUser.role != USER_ROLES.TEACHER) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  var orgMSP = 'academy';

  try {
    const walletPath = path.join(process.cwd(), `./cli/wallet-${orgMSP}/`);
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists(createdUser.username);
    if (userExists) {
      console.log(`An identity for the user ${createdUser.username} already exists in the wallet`);
      return;
    }

    const ca = networkObj.gateway.getClient().getCertificateAuthority();
    const adminIdentity = networkObj.gateway.getCurrentIdentity();

    const secret = await ca.register(
      {
        affiliation: '',
        enrollmentID: createdUser.username,
        role: 'client',
        attrs: [{ name: 'username', value: createdUser.username, ecert: true }]
      },
      adminIdentity
    );

    const enrollment = await ca.enroll({
      enrollmentID: createdUser.username,
      enrollmentSecret: secret
    });
    const userIdentity = X509WalletMixin.createIdentity(
      `${changeCaseFirstLetter(orgMSP)}`,
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import(createdUser.username, userIdentity);
    console.log(
      `Successfully registered and enrolled admin user ${createdUser.username} and imported it into the wallet`
    );

    networkObj.contract.submitTransaction(
      'CreateTeacher',
      createdUser.username,
      createdUser.fullname,
      createdUser.address,
      createdUser.phonenumber
    );

    await networkObj.gateway.disconnect();
    let response = `Successfully registered!`;
    return response;
  } catch (error) {
    console.error(`Failed to register!`);
    let response = {};
    response.error = error;
    return response;
  }
};

exports.registerStudentOnBlockchain = async function(createdUser) {
  if (!createdUser.username) {
    let response = {};
    response.error = 'Error! You need to fill all fields before you can register!';
    return response;
  }

  var orgMSP = 'student';
  var nameMSP = 'Student';

  try {
    const ccpPath = path.resolve(
      __dirname,
      '../../..',
      'certificate-network',
      `connection-${orgMSP}.json`
    );
    const walletPath = path.join(process.cwd(), `./cli/wallet-${orgMSP}`);
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists(createdUser.username);
    if (userExists) {
      console.log(`An identity for the user ${createdUser.username} already exists in the wallet`);
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: process.env.ADMIN_STUDENT_USERNAME,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    const network = await gateway.getNetwork('certificatechannel');
    const contract = await network.getContract('academy');

    await contract.submitTransaction(
      'CreateStudent',
      createdUser.username,
      createdUser.fullname,
      createdUser.address,
      createdUser.phonenumber
    );

    let user = new User({
      username: createdUser.username,
      password: createdUser.password,
      role: USER_ROLES.STUDENT
    });

    await user.save(async (err, user) => {
      if (err) throw err;
      if (user) {
        const secret = await ca.register(
          {
            affiliation: '',
            enrollmentID: user.username,
            role: 'client',
            attrs: [{ name: 'username', value: user.username, ecert: true }]
          },
          adminIdentity
        );

        const enrollment = await ca.enroll({
          enrollmentID: user.username,
          enrollmentSecret: secret
        });

        const userIdentity = X509WalletMixin.createIdentity(
          `${nameMSP}MSP`,
          enrollment.certificate,
          enrollment.key.toBytes()
        );

        await wallet.import(user.username, userIdentity);
      }
    });

    let response = {
      success: true,
      msg: 'Register success!'
    };

    await gateway.disconnect();
    return response;
  } catch (error) {
    console.error(`Failed to register!`);
    let response = {
      success: false,
      msg: error
    };
    return response;
  }
};

function changeCaseFirstLetter(params) {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}
