'use strict';

const shim = require('fabric-shim');
const md5 = require("md5")
const uuidv4 = require('uuid/v4');
const pick = require("lodash/pick")

const validator = require("./validator")
const commonInteraction = require("./common").chaincodeInteraction
const USER_ROLE = require("./common").USER_ROLE

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let UserChaincode = class  {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated User Chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();

    let method = this[ret.fcn];
    if (!method) {
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }

    if (ret.params.length > 1) {
      throw new Error("Invalid arguments. Just one!")
    }

    try {
      let payload = await method(stub, JSON.parse(ret.params[0]), this);
      return shim.success(payload);
    } catch (err) {
      return shim.error(err);
    }
  }

  //  @args:
  //    args[0]:
  //      email:
  //      password:
  //      role:
  async createUser(stub, arg, thisClass) {
    const user = validator.createUserValidator(arg)

    const emailIndex = ['_design/indexEmailPasswordDoc', 'indexEmailPassword']
    const res = await commonInteraction.getObjectByProperties(stub, {'email': user['email']}, {'use_index': emailIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`Email ${user['email']} was existed. Choose another one.`)
    }

    // generate user id
    const userId = uuidv4()
    user['id'] = userId
    user['password'] = md5(user['password'])

    const pushUser = pick(user,
      ['id', 'email', 'password', 'role'])

    await stub.putState(userId, Buffer.from(JSON.stringify(pushUser)))
    return returnAsStringBytes({user_id: userId})
  }

  //  @args:
  //    args[0]:
  //      user_id
  async getUser(stub, arg, thisClass) {

    const userId = arg.user_id
    if (!userId) {
      throw new Error("Request need user_id")
    }

    const userAsBytes = await stub.getState(userId)
    if (!userAsBytes || userAsBytes.length === 0) {
      throw new Error(`${userId} does not exist`)
    }

    const user = JSON.parse(userAsBytes.toString())
    delete user['password']
    return returnAsStringBytes(user)
  }

  //  @args:
  //    args[0]:
  //      email: string
  //      password: string
  async getUserByEmailPassword(stub, arg, thisClass) {
    const userReq = validator.getUserByEmailPasswordValidator(arg)

    userReq['password'] = md5(userReq['password'])

    const emailIndex = ['_design/indexEmailPasswordDoc', 'indexEmailPassword']
    const res = await commonInteraction.getObjectByProperties(stub, userReq, {'use_index': emailIndex})
    if (!Array.isArray(res.results) || res.results.length !== 1) {
      throw Error(`Invalid email or password user admin`)
    }

    const user = res.results[0]
    delete user['password']
    return returnAsStringBytes(user)
  }
}

shim.start(new UserChaincode())
