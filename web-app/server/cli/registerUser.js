'use strict';

const argv = require('yargs').argv;
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

/**
 * Register user for org
 * @param  {String} orgid  Org Name (default: student)
 * @param  {String} userid User Name (required)
 */

async function main() {
  try {
    let userId;
    let orgId = 'student';

    if (!argv.userid) {
      console.log(`User Id cannot undefined`);
      return;
    } else {
      userId = argv.userid.toString();
    }

    if (argv.orgid) {
      orgId = argv.orgid.toString();
    }

    let nameMSP = await changeCaseFirstLetter(orgId);

    const ccpPath = path.resolve(
      __dirname,
      '../../..',
      'certificate-network',
      `connection-${orgId}.json`
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), `wallet-${orgId}`);
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userId);
    if (userExists) {
      console.log(`An identity for the user ${userId} already exists in the wallet-${orgId}`);
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    //Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      { affiliation: '', enrollmentID: userId, role: 'client' },
      adminIdentity
    );

    const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity(
      `${nameMSP}MSP`,
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import(userId, userIdentity);
    console.log(
      `Successfully registered and enrolled admin user ${userId} and imported it into the wallet`
    );

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
