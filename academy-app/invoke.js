/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var yargs = require('yargs');

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'certificate-network', 'connection-academy.json');

async function main() {
    try {
        var argv = yargs.argv;
        var user = argv.user.toString();

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
            console.log(`Run the registerUser.js --user ${user} application before retrying`);
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: user,
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('certificatechannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Submit the specified transaction.
        // CreateStudent transaction - requires 2 argument, ex: ('CreateCar', '20156426', 'Hoang Ngoc Phuc')
        var FunctionName = argv.f.toString();
        if (FunctionName == 'CreateStudent'){
            var StudentID = argv.id.toString();
            var StudentName = argv.name.toString();
            await contract.submitTransaction(FunctionName, StudentID, StudentName);
        }else if (FunctionName == 'CreateSubject'){
            var SubjectID = argv.id.toString();
            var SubjectCode = argv.code.toString();
            var SubjectName = argv.name.toString();
            var SubjectWeight = argv.weight.toString();
            await contract.submitTransaction(FunctionName, SubjectID, SubjectCode, SubjectName, SubjectWeight);
        }else if (FunctionName == 'CreateScore'){
            var SubjectID = argv.subjectId.toString();
            var StudentID = argv.studentId.toString();
            var Score = argv.score.toString();
            await contract.submitTransaction(FunctionName, SubjectID, StudentID, Score);
        }else if (FunctionName == 'CreateCertificate'){
            var StudentID = argv.studentId.toString();
            await contract.submitTransaction(FunctionName, StudentID);
        }

        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
