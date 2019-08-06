'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let StudentDegreeChaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Student Degree Chaincode ===========');
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
  //      student_id:
  //  Granting conditions:
  //    1. Complete all required courses
  //    2. Has no course granted F
  //    3. CPA is great than or equal 2.0
  async grantStudentDegree(stub, arg, thisClass) {
    const studentDegree = validator.grantStudentDegreeValidator(arg)

    // check valid degree
    const studentDegreeIndex = ['_design/indexStudentIdDegreeIdDoc', 'indexStudentIdDegreeId']
    const req = {
      'degree_id': studentDegree['degree_id'],
      'student_id': studentDegree['student_id']
    }
    const res = await commonInteraction.getObjectByProperties(stub, req, {'use_index': studentDegreeIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`Student id "${studentDegree['student_id']}" with Degree id "${studentDegree['student_id']}" was existed. Choose another one.`)
    }

    let degree = await thisClass.invokeGetDegree(stub, studentDegree['degree_id'])
    let studentCourses = await thisClass.invokeGetStudentCourseByStudent(stub, studentDegree['student_id'], degree.courses)
    // 1. Complete all required courses
    console.log("degree.courses: ", degree.courses)
    console.log("studentCourses: ", studentCourses)
    if (studentCourses.length !== degree.courses.length) {
      return returnAsStringBytes({student_degree: false, message: `Have not completed required courses.`})
    }
    let totalScore = 0, totalCredits = 0
    for (let score of studentCourses) {
      // 2. Has no course granted F
      const gradeScore = validator.convertLetterScoreToGradeScore(score['letter_score'])
      if (!gradeScore) {
        return returnAsStringBytes({student_degree: false, message: `Course ${score['course_id']} not pass.`})
      }
      const course = await thisClass.invokeGetCourse(stub, score['course_id'])
      totalScore += gradeScore * parseInt(course['num_credits'])
      totalCredits += parseInt(course['num_credits'])
    }

    // Calculate CPA
    const CPA = (1.0 * totalScore / totalCredits).toFixed(2)
    console.log("CPA", CPA)
    const degreeClassification = validator.classifyDegree(CPA)
    // 3. CPA is great than or equal 2.0
    if (!degreeClassification) {
      return returnAsStringBytes({student_degree: false, message: `CPA ${CPA} is less than 2.0`})
    }

    // generate student id
    const studentDegreeId = uuid4()
    studentDegree['id'] = studentDegreeId
    studentDegree['hash_key'] = stub.getTxID()
    studentDegree['rank_degree'] = degreeClassification
    studentDegree['year'] = new Date().getFullYear()
    const pushStudentDegree = pick(studentDegree,
      ['id', 'degree_id', 'student_id', 'school_id', 'issuer_id', 'hash_key', 'year', 'rank_degree'])

    await stub.putState(pushStudentDegree['id'], Buffer.from(JSON.stringify(pushStudentDegree)))
    return returnAsStringBytes({student_degree: pushStudentDegree})

  }


  async invokeGetCourse(stub, courseId) {
    // query course weight
    const queryCourse = JSON.stringify({
      course_id: courseId
    })
    const courseAsBytes = await stub.invokeChaincode('course', ['getCourse', queryCourse], stub.getChannelID())
    const course = JSON.parse(courseAsBytes.payload.buffer.toString('utf8', courseAsBytes.payload.offset, courseAsBytes.payload.limit))
    return course
  }
  async invokeGetDegree(stub, degreeId) {
    const queryDegree = JSON.stringify({
      degree_id: degreeId
    })
    const degreeAsBytes = await stub.invokeChaincode('degree', ['getDegree', queryDegree], stub.getChannelID())
    return JSON.parse(degreeAsBytes.payload.buffer.toString('utf8', degreeAsBytes.payload.offset, degreeAsBytes.payload.limit))
  }
  async invokeGetStudentCourseByStudent(stub, studentId, onlyCourses) {
    const queryStudentCourse = JSON.stringify({
      student_id: studentId
    })
    const studentCourseAsBytes = await stub.invokeChaincode('student-course',
      ['getStudentCourseByStudent', queryStudentCourse], stub.getChannelID())
    const result = JSON.parse(studentCourseAsBytes.payload.buffer.toString('utf8', studentCourseAsBytes.payload.offset, studentCourseAsBytes.payload.limit))

    let studentCourses = []
    for (let item of result.results) {
      let record = item.Record
      if (onlyCourses.includes(record.course_id)) {
        studentCourses.push(record)
      }
    }
    return studentCourses
  }

  //  @args:
  //    args[0]:
  //      student_degree_id
  async getStudentDegree(stub, arg, thisClass) {
    const studentDegreeId = arg.student_degree_id
    if (!studentDegreeId) {
      throw Error("Request need student_degree_id")
    }

    const studentDegreeAsBytes = await stub.getState(studentDegreeId)
    if (!studentDegreeAsBytes || studentDegreeAsBytes.length === 0) {
      throw Error(`Student ${studentDegreeId} does not exist`)
    }
    return studentDegreeAsBytes
  }

  //  @args:
  //    args[0]:
  //      student_id: string
  async getStudentDegreeByHashKey(stub, arg, thisClass) {
    const hashKey = arg['hash_key']
    if (!hashKey) {
      throw Error("Request need hash_key")
    }
    const req = {hash_key: hashKey}
    const hashKeyIndex = ['_design/indexHashKeyStudentDegreeDoc', 'indexHashKeyStudentDegree']
    let config = {
      'useIndex': hashKeyIndex
    }

    const res = await commonInteraction.getObjectByProperties(stub, req, config)
    if (!Array.isArray(res.results) || !res.results.length) {
      throw Error(`Cannot get any degree for any student from hash key ${hashKey}`)
    }
    return returnAsStringBytes(res)
  }

  //  @args:
  //    args[0]:
  //      school_id: string
  async getStudentDegreeBySchoolId(stub, arg, thisClass) {
    const schoolId = arg['school_id']
    if (!schoolId) {
      throw Error("Request need school_id")
    }
    const req = {school_id: schoolId}
    const schoolIdIndex = ['_design/indexSchoolIdStudentDegreeDoc', 'indexSchoolIdStudentDegree']
    let config = {
      'useIndex': schoolIdIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 10
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)

    return returnAsStringBytes(res)
  }

}

shim.start(new StudentDegreeChaincode())
