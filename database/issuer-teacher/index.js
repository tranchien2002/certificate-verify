'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let IssuerTeacherChaincode = class  {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated IssuerTeacher Chaincode ===========');
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
  //      user_id:
  //      name:
  //      phone:
  //      address:
  //      role:
  async createIssuerTeacher(stub, arg, thisClass) {
    const issuerTeacher = validator.createIssuerTeacherValidator(arg)

    const userIndex = ['_design/indexUserIdDoc', 'indexUserId']
    const res = await commonInteraction.getObjectByProperties(stub, {'user_id': issuerTeacher['user_id']}, {'use_index': userIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`User id "${issuerTeacher['user_id']}" was existed. Choose another one.`)
    }

    // generate issuerTeacher id
    const issuerTeacherId = uuid4()
    issuerTeacher['id'] = issuerTeacherId

    const pushIssuer = pick(issuerTeacher,
      ['id', 'school_id', 'user_id', 'name', 'phone', 'address', 'role'])

    await stub.putState(issuerTeacherId, Buffer.from(JSON.stringify(pushIssuer)))
    return returnAsStringBytes({issuerTeacher_id: issuerTeacherId})
  }

  //  @args:
  //    args[0]:
  //      issuer_teacher_id
  async getIssuerTeacher(stub, arg, thisClass) {
    const issuerTeacherId = arg.issuer_teacher_id
    if (!issuerTeacherId) {
      throw Error("Request need issuer_teacher_id")
    }

    const issuerTeacherAsBytes = await stub.getState(issuerTeacherId)
    if (!issuerTeacherAsBytes || issuerTeacherAsBytes.length === 0) {
      throw Error(`${issuerTeacherId} does not exist`)
    }

    const issuerTeacher = JSON.parse(issuerTeacherAsBytes.toString())
    return returnAsStringBytes(issuerTeacher)
  }

  //  @args:
  //    args[0]:
  //      id
  //      name:
  //      phone:
  //      address:
  async updateIssuerTeacher(stub, arg, thisClass) {
    const issuerTeacherId = arg.id
    if (!issuerTeacherId) {
      throw Error("Request need id")
    }

    const issuerTeacherAsBytes = await thisClass.getIssuerTeacher(stub, {issuer_teacher_id: issuerTeacherId})

    const pushIssuerTeacher = validator.updateIssuerTeacherValidator(JSON.parse(issuerTeacherAsBytes.toString()), arg)

    await stub.putState(pushIssuerTeacher['id'], Buffer.from(JSON.stringify(pushIssuerTeacher)))
    return returnAsStringBytes({id: pushIssuerTeacher['id']})
  }

  //  @args:
  //    args[0]:
  //      user_id
  async getIssuerTeacherByUser(stub, arg, thisClass) {
    const issuerReq = validator.getIssuerTeacherByUserValidator(arg)

    const req = {
      user_id: issuerReq.user_id
    }
    const userIndex = ['_design/indexUserIdDoc', 'indexUserId']
    const res = await commonInteraction.getObjectByProperties(stub, req, {'use_index': userIndex})
    if (!Array.isArray(res.results) || res.results.length !== 1) {
      throw Error(`Invalid User id`)
    }

    const issuerTeacher = res.results[0]
    return returnAsStringBytes(issuerTeacher)
  }

  //  @args:
  //    args[0]:
  //      school_id: string
  //      role: number (2 or 3)
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getIssuerTeacherBySchool(stub, arg, thisClass) {
    const schoolId = arg['school_id']
    if (!schoolId) {
      throw Error("Request need school_id")
    }
    const role = arg['role']
    if (!role) {
      throw Error("Request need role")
    }
    const req = {school_id: schoolId, role: role}
    const schoolIndex = ['_design/indexSchoolIdDoc', 'indexSchoolId']
    let config = {
      'useIndex': schoolIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 10
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)
    return returnAsStringBytes(res)
  }

}

shim.start(new IssuerTeacherChaincode())
