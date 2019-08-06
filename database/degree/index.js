'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let DegreeChaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Degree Chaincode ===========');
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
  //      school_id:
  //      name:
  //      degree_type:
  //      institute:
  async createDegree(stub, arg, thisClass) {
    const degree = validator.createDegreeValidator(arg)

    // generate degree id
    const degreeId = uuid4()
    degree['id'] = degreeId

    const pushDegree = pick(degree, ['id', 'school_id', 'name', 'degree_type', 'institute', 'courses'])

    await stub.putState(degreeId, Buffer.from(JSON.stringify(pushDegree)))
    return returnAsStringBytes({degree_id: degreeId})
  }

  //  @args:
  //    args[0]:
  //      degree_id
  async getDegree(stub, arg, thisClass) {
    const degreeId = arg.degree_id
    if (!degreeId) {
      throw Error("Request need degree_id")
    }

    const degreeAsBytes = await stub.getState(degreeId)
    if (!degreeAsBytes || degreeAsBytes.length === 0) {
      throw Error(`Degree ${degreeId} does not exist`)
    }
    return degreeAsBytes
  }

  //  @args:
  //    args[0]:
  //      id:
  //      name:
  //      institute:
  async updateDegree(stub, arg, thisClass) {
    if (!arg['id']) {
      throw Error("Request need degree id")
    }
    const degreeAsBytes = await thisClass.getDegree(stub, {degree_id: arg['id']})
    const pushDegree = validator.updateDegreeValidator(JSON.parse(degreeAsBytes.toString()), arg)

    await stub.putState(pushDegree['id'], Buffer.from(JSON.stringify(pushDegree)))
    return returnAsStringBytes({id: pushDegree['id']})
  }

  //  @args:
  //    args[0]:
  //      school_id: string
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getDegreeBySchool(stub, arg, thisClass) {
    const schoolId = arg['school_id']
    if (!schoolId) {
      throw Error("Request need school_id")
    }
    const req = {school_id: schoolId}
    const schoolIndex = ['_design/indexSchoolIdDegreeDoc', 'indexSchoolIdDegree']
    let config = {
      'useIndex': schoolIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 10
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)

    return returnAsStringBytes(res)
  }
}

shim.start(new DegreeChaincode())
