'use strict';

const shim = require('fabric-shim');
const md5 = require("md5")
const uuidv4 = require('uuid/v4');
const pick = require("lodash/pick")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let SchoolChaincode = class  {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated School Chaincode ===========');
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
  //      user_id
  //      name:
  //      admin_name:
  //      address:
  async createSchool(stub, arg, thisClass) {
    const school = validator.createSchoolValidator(arg)

    const userIndex = ['_design/indexUserIdDoc', 'indexUserId']
    const res = await commonInteraction.getObjectByProperties(stub, {'user_id': school['user_id']}, {'useIndex': userIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`User id ${school['user_id']} was existed. Choose another one.`)
    }

    // generate school id
    const schoolId = uuidv4()
    school['id'] = schoolId
    const pushSchool = pick(school,
      ['id', 'user_id', 'name', 'admin_name', 'address'])

    await stub.putState(schoolId, Buffer.from(JSON.stringify(pushSchool)))
    return returnAsStringBytes({school_id: schoolId})
  }

  //  @args:
  //    args[0]:
  //      school_id
  async getSchool(stub, arg, thisClass) {

    const schoolId = arg.school_id
    if (!schoolId) {
      throw new Error("Request need school_id")
    }

    const schoolAsBytes = await stub.getState(schoolId)
    if (!schoolAsBytes || schoolAsBytes.length === 0) {
      throw new Error(`${schoolId} does not exist`)
    }

    const school = JSON.parse(schoolAsBytes.toString())
    delete school['password']
    return returnAsStringBytes(school)
  }

  //  @args:
  //    args[0]:
  //      user_id
  async getSchoolByUserId(stub, arg, thisClass) {

    const userId = arg.user_id
    if (!userId) {
      throw new Error("Request need user_id")
    }

    const userIndex = ['_design/indexUserIdDoc', 'indexUserId']
    const res = await commonInteraction.getObjectByProperties(stub, {'user_id': userId}, {'useIndex': userIndex})
    if (!res.results.length) {
        throw Error(`User id ${userId} not found. Choose another one.`)
    }

    return returnAsStringBytes(res.results[0])
  }

}

shim.start(new SchoolChaincode())
