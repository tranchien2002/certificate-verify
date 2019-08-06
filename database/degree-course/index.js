'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let DegreeCourseChaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Degree Course Chaincode ===========');
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
  //      degree_id:
  //      course_id:
  async createDegreeCourse(stub, arg, thisClass) {
    const degreeCourse = validator.createDegreeCourseValidator(arg)

    const degreeCourseIndex = ['_design/indexDegreeIdCourseIdDoc', 'indexDegreeIdCourseId']
    const req = {
      'degree_id': degreeCourse['degree_id'],
      'course_id': degreeCourse['course_id']
    }
    const res = await commonInteraction.getObjectByProperties(stub, req, {'use_index': degreeCourseIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`Course id "${degreeCourse['course_id']}" in Degree id "${degreeCourse['degree_id']}" was existed. Choose another one.`)
    }

    // generate degree id
    const degreeCourseId = uuid4()
    degreeCourse['id'] = degreeCourseId

    const pushDegreeCourse = pick(degreeCourse, ['id', 'degree_id', 'course_id'])

    await stub.putState(degreeCourseId, Buffer.from(JSON.stringify(pushDegreeCourse)))
    return returnAsStringBytes({degree_course_id: degreeCourseId})
  }

  //  @args:
  //    args[0]:
  //      degree_course_id
  async getDegreeCourse(stub, arg, thisClass) {
    const degreeCourseId = arg.degree_course_id
    if (!degreeCourseId) {
      throw Error("Request need degree_course_id")
    }

    const degreeCourseAsBytes = await stub.getState(degreeCourseId)
    if (!degreeCourseAsBytes || degreeCourseAsBytes.length === 0) {
      throw Error(`Degree Course ${degreeCourseId} does not exist`)
    }
    return degreeCourseAsBytes
  }

  //  @args:
  //    args[0]:
  //      id:
  //      course_id: (optional)
  //      degree_id: (optional)
  async updateDegreeCourse(stub, arg, thisClass) {
    if (!arg['id']) {
      throw Error("Request need degree course id")
    }
    const degreeCourseAsBytes = await thisClass.getDegreeCourse(stub, {degree_course_id: arg['id']})

    const pushDegreeCourse = validator.updateDegreeCourseValidator(JSON.parse(degreeCourseAsBytes.toString()), arg)

    await stub.putState(pushDegreeCourse['id'], Buffer.from(JSON.stringify(pushDegreeCourse)))
    return returnAsStringBytes({id: pushDegreeCourse['id']})
  }

  //  @args:
  //    args[0]:
  //      degree_id: string
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getDegreeCourseByDegree(stub, arg, thisClass) {
    const degreeId = arg['degree_id']
    if (!degreeId) {
      throw Error("Request need degree_id")
    }
    const req = {degree_id: degreeId}
    const degreeIndex = ['_design/indexDegreeIdDegreeCourseDoc', 'indexDegreeIdDegreeCourse']
    let config = {
      'useIndex': degreeIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 10
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)

    return returnAsStringBytes(res)
  }
}

shim.start(new DegreeCourseChaincode())
