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
        var teacher_id = argv.teacherid.toString();

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(teacher_id);
        if (!userExists) {
            console.log(`An identity for the user ${teacher_id} does not exist in the wallet`);
            console.log(`Run the registerUser.js --user ${teacher_id} application before retrying`);
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: teacher_id,
            discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('certificatechannel');

        // Get the contract from the network.
        const contract = network.getContract('mycc');

        // Evaluate the specified transaction.
        // QueryStudent transaction - requires 1 argument, ex: ('QueryStudent', '20156425')
        var FunctionName = argv.f.toString();
        if (FunctionName == 'QueryStudent'){
            var StudentID = argv.studentid.toString();
            const result = await contract.evaluateTransaction(FunctionName, StudentID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        }else if (FunctionName == 'QuerySubject'){
            var SubjectID = argv.subjectid.toString();
            const result = await contract.evaluateTransaction(FunctionName, SubjectID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        }else if (FunctionName == 'QueryCertificate'){
            var StudentID = argv.studentid.toString();
            const result = await contract.evaluateTransaction(FunctionName, StudentID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        }else if (FunctionName == 'QueryScore') {
            var SubjectID = argv.subjectid.toString();
            var StudentID = argv.studentid.toString();
            const result = await contract.evaluateTransaction(FunctionName, SubjectID, StudentID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        }else if (FunctionName == 'GetAllStudents' || FunctionName == 'GetAllSubjects' || FunctionName == 'GetAllScores' || FunctionName == 'GetAllCertificates') {
            const result = await contract.evaluateTransaction(FunctionName);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        }

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
