'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let StudentCourseChaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Student Course Chaincode ===========');
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
  //      course_id:
  //      student_id:
  //      mid_term:
  //      last_term:
  async createStudentCourse(stub, arg, thisClass) {
    const studentCourse = validator.createStudentCourseValidator(arg)

    const studentCourseIndex = ['_design/indexStudentIdCourseIdDoc', 'indexStudentIdCourseId']
    const req = {
      'course_id': studentCourse['course_id'],
      'student_id': studentCourse['student_id']
    }
    const res = await commonInteraction.getObjectByProperties(stub, req, {'use_index': studentCourseIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`Student id "${studentCourse['student_id']}" in Course id "${studentCourse['student_id']}" was existed. Choose another one.`)
    }

    // query course weight
    const queryCourse = JSON.stringify({
      course_id: studentCourse['course_id']
    })
    const courseAsBytes = await stub.invokeChaincode('course', ['getCourse', queryCourse], stub.getChannelID())
    const course = JSON.parse(courseAsBytes.payload.buffer.toString('utf8', courseAsBytes.payload.offset, courseAsBytes.payload.limit))

    let average = parseFloat(studentCourse['mid_term']) * course['weight'] +
      parseFloat(studentCourse['last_term']) * (1 - course['weight'])
    average = average.toFixed(1)
    const letterScore = validator.convertNumericToGradeLetter(average)
    studentCourse['average_score'] = average
    studentCourse['letter_score'] = letterScore

    // generate student id
    const studentCourseId = uuid4()
    studentCourse['id'] = studentCourseId
    const pushStudentCourse = pick(studentCourse,
      ['id', 'course_id', 'student_id', 'mid_term', 'last_term',
        'average_score', 'letter_score'])

    await stub.putState(studentCourseId, Buffer.from(JSON.stringify(pushStudentCourse)))
    return returnAsStringBytes({student_course_id: studentCourseId})
  }

  //  @args:
  //    args[0]:
  //      student_course_id
  async getStudentCourse(stub, arg, thisClass) {
    const studentCourseId = arg.student_course_id
    if (!studentCourseId) {
      throw Error("Request need student_course_id")
    }

    const studentCourseAsBytes = await stub.getState(studentCourseId)
    if (!studentCourseAsBytes || studentCourseAsBytes.length === 0) {
      throw Error(`Student ${studentCourseId} does not exist`)
    }
    return studentCourseAsBytes
  }

  //  @args:
  //    args[0]:
  //      id:
  //      course_id: (optional)
  //      student_id: (optional)
  //      mid_term: (optional)
  //      last_term: (optional)
  async updateStudentCourse(stub, arg, thisClass) {
    if (!arg['id']) {
      throw Error("Request need student course id")
    }
    const studentCourseAsBytes = await thisClass.getStudentCourse(stub, {student_course_id: arg['id']})

    const pushStudentCourse = validator.updateStudentCourseValidator(JSON.parse(studentCourseAsBytes.toString()), arg)

    // query course weight
    const queryCourse = JSON.stringify({
      course_id: pushStudentCourse['course_id']
    })
    const courseAsBytes = await stub.invokeChaincode('course', ['getCourse', queryCourse], stub.getChannelID())
    const course = JSON.parse(courseAsBytes.payload.buffer.toString('utf8', courseAsBytes.payload.offset, courseAsBytes.payload.limit))

    let average = parseFloat(pushStudentCourse['mid_term']) * course['weight'] +
      parseFloat(pushStudentCourse['last_term']) * (1 - course['weight'])
    average = average.toFixed(1)
    const letterScore = validator.convertNumericToGradeLetter(average)
    pushStudentCourse['average_score'] = average
    pushStudentCourse['letter_score'] = letterScore

    await stub.putState(pushStudentCourse['id'], Buffer.from(JSON.stringify(pushStudentCourse)))
    return returnAsStringBytes({id: pushStudentCourse['id']})
  }

  //  @args:
  //    args[0]:
  //      course_id: string
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getStudentCourseByCourse(stub, arg, thisClass) {
    const courseId = arg['course_id']
    if (!courseId) {
      throw Error("Request need course_id")
    }
    const req = {course_id: courseId}
    const courseIndex = ['_design/indexCourseIdStudentCourseDoc', 'indexCourseIdStudentCourse']
    let config = {
      'useIndex': courseIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 100
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)

    return returnAsStringBytes(res)
  }

  //  @args:
  //    args[0]:
  //      student_id: string
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getStudentCourseByStudent(stub, arg, thisClass) {
    const studentId = arg['student_id']
    if (!studentId) {
      throw Error("Request need student_id")
    }
    const req = {student_id: studentId}
    const studentIndex = ['_design/indexStudentIdStudentCourseDoc', 'indexStudentIdStudentCourse']
    let config = {
      'useIndex': studentIndex
    }
    if (parseInt(arg['page_size'])) {
      config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 100
      config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined
    }

    const res = await commonInteraction.getObjectByProperties(stub, req, config)

    return returnAsStringBytes(res)
  }
}

shim.start(new StudentCourseChaincode())
