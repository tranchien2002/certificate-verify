'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let CourseChaincode = class  {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Course Chaincode ===========');
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
  //      course_code:
  //      course_name:
  //      num_credits:
  //      institute:
  async createCourse(stub, arg, thisClass) {
    const course = validator.createCourseValidator(arg)

    const courseIndex = ['_design/indexSchoolIdCourseNameDoc', 'indexSchoolIdCourseName']
    const req = {
      'school_id': course['school_id'],
      'course_code': course['course_code']
    }
    const res = await commonInteraction.getObjectByProperties(stub, req, {'use_index': courseIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`Course code "${course['course_code']}" was existed. Choose another one.`)
    }

    // generate course id
    const courseId = uuid4()
    course['id'] = courseId

    const pushCourse = pick(course,
      ['id', 'school_id', 'course_code', 'course_name', 'num_credits', 'weight', 'institute'])

    await stub.putState(courseId, Buffer.from(JSON.stringify(pushCourse)))
    return returnAsStringBytes({course_id: courseId})
  }

  //  @args:
  //    args[0]:
  //      course_id
  async getCourse(stub, arg, thisClass) {
    const courseId = arg.course_id
    if (!courseId) {
      throw Error("Request need course_id")
    }

    const courseAsBytes = await stub.getState(courseId)
    if (!courseAsBytes || courseAsBytes.length === 0) {
      throw Error(`Course ${courseId} does not exist`)
    }
    return courseAsBytes
  }

  //  @args:
  //    args[0]:
  //      id
  //      school_id:
  //      course_code:
  //      course_name:
  //      num_credits:
  //      weight:
  //      institute:
  async updateCourse(stub, arg, thisClass) {
    if (!arg['id']) {
      throw Error("Request need course id")
    }
    const courseAsBytes = await thisClass.getCourse(stub, {course_id: arg['id']})

    const updatedCourse = validator.updateCourseValidator(JSON.parse(courseAsBytes.toString()), arg)

    await stub.putState(updatedCourse['id'], Buffer.from(JSON.stringify(updatedCourse)))
    return returnAsStringBytes({id: updatedCourse['id']})
  }

  //  @args:
  //    args[0]:
  //      school_id: string
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getCourseBySchool(stub, arg, thisClass) {
    const schoolId = arg['school_id']
    if (!schoolId) {
      throw Error("Request need school_id")
    }
    const req = {school_id: schoolId}
    const schoolIndex = ['_design/indexSchoolIdCourseDoc', 'indexSchoolIdCourse']
    let config = {
      'useIndex': schoolIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 10
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)

    return returnAsStringBytes(res)
  }

}

shim.start(new CourseChaincode())
