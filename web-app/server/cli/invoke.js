'use strict';

const argv = require('yargs').argv;
const path = require('path');
const conn = require('../fabric/network');

async function main() {
  try {
    if (!argv.func || !argv.userid) {
      console.log(`Parameter func or userid cannot undefined`);
      return;
    }

    let FunctionName = argv.func.toString();
    let userId = argv.userid.toString();
    let orgId = 'student';

    if (argv.orgid) {
      orgId = argv.orgid.toString();
    }

    const networkObj = await conn.connectToNetwork(userId, orgId, true);

    // Submit the specified transaction.
    if (FunctionName === 'CreateStudent') {
      let StudentId = argv.studentid.toString();
      let StudentName = argv.studentname.toString();

      await conn.createStudent(networkObj, StudentId, StudentName);
    } else if (FunctionName == 'CreateSubject' && userId == 'admin') {
      let SubjectID = argv.subjectid.toString();
      let SubjectCode = argv.subjectcode.toString();
      let Name = argv.subjectname.toString();
      let Weight = argv.weight.toString();

      await conn.createSubject(networkObj, SubjectID, SubjectCode, Name, Weight);
      console.log('Transaction has been submitted');
      process.exit(0);
    } else if (FunctionName == 'CreateScore') {
      let SubjectID = argv.subjectid.toString();
      let StudentID = argv.studentid.toString();
      let Score = argv.score.toString();

      await conn.createScore(networkObj, SubjectID, StudentID, Score);
      console.log('Transaction has been submitted');
      process.exit(0);
    } else if (FunctionName == 'CreateCertificate') {
      let StudentID = argv.studentid.toString();

      await conn.createCertificate(networkObj, StudentID);
      console.log('Transaction has been submitted');
      process.exit(0);
    } else {
      console.log('Failed!');
      process.exit(0);
    }

    // Disconnect from the gateway.
    await networkObj.gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
