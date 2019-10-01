'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;

async function main() {
  try {
    let orgId = 'student';

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

    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[`ca.${orgId}.certificate.com`];
    const caTLSCACertsPath = path.resolve(
      __dirname,
      '../../..',
      'certificate-network',
      caInfo.tlsCACerts.path
    );
    const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), `wallet-${orgId}`);
    const wallet = new FileSystemWallet(walletPath);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
      console.log('An identity for the admin user "admin" already exists in the wallet');
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const identity = X509WalletMixin.createIdentity(
      `${nameMSP}MSP`,
      enrollment.certificate,
      enrollment.key.toBytes()
    );
    await wallet.import('admin', identity);
    console.log(
      `Successfully enrolled admin user "admin" and imported it into the wallet-${orgId}`
    );
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
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
