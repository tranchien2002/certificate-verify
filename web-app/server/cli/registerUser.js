'use strict';

const argv = require('yargs').argv;
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;

/**
 * Register user for org
 * @param  {String} orgMSP  Org Name (default: student)
 * @param  {String} username User Name (required)
 */

async function main() {
  try {
    let username;
    let password;
    let fullname;
    let address;
    let phoneNumber;
    let orgMSP = 'student';
    let admin;

    if (!argv.username) {
      console.log(`Username cannot undefined`);
      return;
    } else {
      username = argv.username.toString();
    }

    if (!argv.password) {
      console.log(`Password cannot undefined`);
    } else {
      password = argv.password.toString();
    }

    if (!argv.fullname) {
      console.log(`Fullname cannot undefined`);
    } else {
      fullname = argv.fullname.toString();
    }

    if (!argv.address) {
      console.log(`Address cannot undefined`);
    } else {
      address = argv.address.toString();
    }

    if (!argv.phonenumber) {
      console.log(`Phonenumber cannot undefined`);
    } else {
      phoneNumber = argv.phonenumber.toString();
    }

    if (!argv.admin) {
      console.log(`Must have admin account`);
    } else {
      admin = argv.admin.toString();
    }

    if (argv.orgMSP) {
      orgMSP = argv.orgMSP.toString();
    }

    let nameMSP = await changeCaseFirstLetter(orgMSP);

    const ccpPath = path.resolve(
      __dirname,
      '../../..',
      'certificate-network',
      `connection-${orgMSP}.json`
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), `wallet-${orgMSP}`);
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(username);
    if (userExists) {
      console.log(`An identity for the user ${username} already exists in the wallet-${orgMSP}`);
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(admin);
    if (!adminExists) {
      console.log(`An identity for the admin user ${admin} does not exist in the wallet`);
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: admin,
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    //Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: '',
        enrollmentID: username,
        role: 'client',
        attrs: [{ name: 'username', value: username, ecert: true }]
      },
      adminIdentity
    );

    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret
    });

    const userIdentity = X509WalletMixin.createIdentity(
      `${nameMSP}MSP`,
      enrollment.certificate,
      enrollment.key.toBytes()
    );

    await wallet.import(username, userIdentity);

    await console.log(
      `Successfully registered and enrolled admin user ${userId} and imported it into the wallet`
    );

    const network = await gateway.getNetwork('certificatechannel');
    const contract = await network.getContract('academy');

    var user;

    if (orgMSP == 'student') {
      await contract.submitTransaction('CreateStudent', username, fullname, address, phoneNumber);
      user = new User({
        username: username,
        password: password,
        role: USER_ROLES.STUDENT
      });
    } else if (orgMSP == 'academy') {
      await contract.submitTransaction('CreateTeacher', username, fullname, address, phoneNumber);
      user = new User({
        username: username,
        password: password,
        role: USER_ROLES.TEACHER
      });
    }

    await user.save();

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    process.exit(1);
  }
}

function changeCaseFirstLetter(params) {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}

main();
