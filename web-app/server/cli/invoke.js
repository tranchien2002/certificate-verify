'use strict';

const argv = require('yargs').argv;
const path = require('path');
const conn = require('../fabric/network');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES;
const Certificate = require('../models/Certificate');

/**
 * Invoke function of chaincode
 * @param  {String} orgMSP  Org Name (default: student)
 * @param  {String} func  Function Name (required)
 * @param  {String} username User Name (required)
 */

async function main() {
  try {
    if (!argv.func || !argv.admin) {
      console.log(`Parameter func or userid cannot undefined`);
      return;
    }

    let FunctionName = argv.func.toString();
    let username = argv.username.toString();

    await User.findOne({ username: username }, async (err, user) => {
      if (err) throw next(err);
      if (user) {
        const networkObj = await conn.connectToNetwork(user, true);
        if (FunctionName == 'CreateSubject' && user.role == USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Subject
           * @param  {String} subjectid Subject Id (required)
           * @param  {String} subjectname Subject Name (required)
           * @param  {String} teacher Teacher Username (required)
           */

          let SubjectID = argv.subjectid.toString();
          let Name = argv.subjectname.toString();
          let Teacher = argv.teacher.toString();

          await conn.createSubject(networkObj, SubjectID, Name, Teacher);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (FunctionName == 'CreateScore' && user.role == USER_ROLES.TEACHER) {
          /**
           * Create Score
           * @param  {String} subjectid Subject Id (required)
           * @param  {String} student Student Username (required)
           * @param  {String} score Point of Subject (required)
           *
           */
          let SubjectID = argv.subjectid.toString();
          let Student = argv.student.toString();
          let Score = argv.score.toString();

          await conn.createScore(networkObj, SubjectID, Student, Score);
          console.log('Transaction has been submitted');
          process.exit(0);
        } else if (FunctionName == 'CreateCertificate' && user.role == USER_ROLES.ADMIN_ACADEMY) {
          /**
           * Create Certificate
           * @param  {String} subjectid Subject Id (required)
           * @param  {String} student Student Username (required)
           */
          let Student = argv.student.toString();
          let SubjectID = argv.subjectid.toString();
          var certificate = new Certificate({
            subjectID: SubjectID,
            username: Student
          });

          await certificate.save(async (err, certificate) => {
            certificate.certificateID = certificate._id;
            await conn.createCertificate(networkObj, certificate);
            console.log('Transaction has been submitted');
          });
          process.exit(0);
        } else {
          console.log('Failed!');
          process.exit(0);
        }

        // Disconnect from the gateway.
        await networkObj.gateway.disconnect();
      }
    });
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
