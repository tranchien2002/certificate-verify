'use strict';

const argv = require('yargs').argv;
const path = require('path');
const conn = require('../fabric/network');
const User = require('../models/User');
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

/**
 * Query function of chaincode
 * @param  {String} func  Function Name (required)
 * @param  {String} username User Name (required)
 * @param  {String} args argument of function (optional)
 */

async function main() {
  try {
    if (!argv.func || !argv.username) {
      console.log(`Parameter func or userid cannot undefined`);
      return;
    }

    let func = 'GetAllStudents';
    let username = 'admin';
    //let args = argv.args;
    let result;
    //let orgId = 'student';

    await User.findOne({ username: username }, async (err, user) => {
      if (err) throw next(err);
      if (user) {
        //console.log(user);
        const networkObj = await conn.connectToNetwork(user, true);
        console.log(networkObj);

        if (typeof args === 'object') {
          result = await networkObj.contract.evaluateTransaction(func, ...args);
        } else if (args) {
          args = args.toString();
          result = await networkObj.contract.evaluateTransaction(func, args);
        } else {
          console.log('3');
          result = await networkObj.contract.evaluateTransaction(func);
        }
        console.log(result);
      }
    });
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

main();
