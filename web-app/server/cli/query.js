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

    let func = argv.func.toString();
    let userId = argv.userid.toString();
    let args = argv.args;
    let orgId = 'student';

    if (argv.orgid) {
      orgId = argv.orgid.toString();
    }

    const networkObj = await conn.connectToNetwork(userId, orgId, true);

    let result;

    if (typeof args === 'object') {
      result = await networkObj.contract.evaluateTransaction(func, ...args);
    } else if (args) {
      args = args.toString();
      result = await networkObj.contract.evaluateTransaction(func, args);
    } else {
      result = await networkObj.contract.evaluateTransaction(func);
    }

    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

main();
