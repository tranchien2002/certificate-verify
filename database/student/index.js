'use strict';

const shim = require('fabric-shim');
const pick = require("lodash/pick")
const uuid4 = require("uuid/v4")

const validator = require("./validator")
const commonInteraction = require("./common")

const returnAsStringBytes = (result) => {
  return Buffer.from(JSON.stringify(result))
}

let StudentChaincode = class {
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Instantiated Student Chaincode ===========');
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
  //      student_code:
  //      name:
  //      class:
  //      school_year:
  //      email:
  //      citizen_id:
  //      sex: female, male
  //      birthday:
  //      address:
  //      phone:
  async createStudent(stub, arg, thisClass) {
    const student = validator.createStudentValidator(arg)

    const studentIndex = ['_design/indexSchoolIdStudentIdDoc', 'indexSchoolIdStudentId']
    const req = {
      'school_id': student['school_id'],
      'student_code': student['student_code']
    }
    const res = await commonInteraction.getObjectByProperties(stub, req, {'use_index': studentIndex})
    if (Array.isArray(res.results) && res.results.length) {
      throw Error(`Student code "${student['student_code']}" was existed. Choose another one.`)
    }

    // generate student id
    const studentId = uuid4()
    student['id'] = studentId

    const pushStudent = pick(student,
      ['id', 'school_id', 'student_code', 'name', 'class', 'school_year',
        'email', 'citizen_id', 'sex', 'birthday', 'address', 'phone'])

    await stub.putState(studentId, Buffer.from(JSON.stringify(pushStudent)))
    return returnAsStringBytes({student_id: studentId})
  }

  //  @args:
  //    args[0]:
  //      student_id
  async getStudent(stub, arg, thisClass) {
    const studentId = arg.student_id
    if (!studentId) {
      throw Error("Request need student_id")
    }

    const studentAsBytes = await stub.getState(studentId)
    if (!studentAsBytes || studentAsBytes.length === 0) {
      throw Error(`Student ${studentId} does not exist`)
    }
    return studentAsBytes
  }

  //  @args:
  //    args[0]:
  //      id:
  //      school_id: (cannot update)
  //      student_code: (optional)
  //      name: (optional)
  //      class: (optional)
  //      school_year: (optional)
  //      email: (optional)
  //      citizen_id: (optional)
  //      sex: (optional)
  //      address: (optional)
  //      phone: (optional)
  async updateStudent(stub, arg, thisClass) {
    if (!arg['id']) {
      throw Error("Request need student id")
    }
    const studentAsBytes = await thisClass.getStudent(stub, {student_id: arg['id']})

    const pushStudent = validator.updateStudentValidator(JSON.parse(studentAsBytes.toString()), arg)

    await stub.putState(pushStudent['id'], Buffer.from(JSON.stringify(pushStudent)))
    return returnAsStringBytes({id: pushStudent['id']})
  }

  //  @args:
  //    args[0]:
  //      school_id: string
  //      page_size: int (optional)
  //      bookmark: string (optional)
  async getStudentBySchool(stub, arg, thisClass) {
    const schoolId = arg['school_id']
    if (!schoolId) {
      throw Error("Request need school_id")
    }
    const req = {school_id: schoolId}
    const schoolIndex = ['_design/indexSchoolIdStudentDoc', 'indexSchoolIdStudent']
    let config = {
      'useIndex': schoolIndex
    }
    config['pageSize'] = parseInt(arg['page_size']) ? parseInt(arg['page_size']) : 10
    config['bookmark'] = arg['bookmark'] ? arg['bookmark'] : undefined

    const res = await commonInteraction.getObjectByProperties(stub, req, config)
    return returnAsStringBytes(res)
  }
}

shim.start(new StudentChaincode())
