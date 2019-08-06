
function createStudentValidator(student) {
  if (!student || !student['school_id']) {
    throw new Error("Request needs school_id")
  }
  if (!student['student_code']) {
    throw new Error("Request needs student_code")
  }
  if (!student['name']) {
    throw new Error("Request needs name")
  }
  if (!student['class']) {
    throw new Error("Request needs class")
  }
  if (!student['school_year']) {
    throw new Error("Request needs school_year")
  }
  if (!student['email']) {
    throw new Error("Request needs email")
  }
  if (!student['citizen_id']) {
    throw new Error("Request needs citizen_id")
  }
  if (!student['sex'] ||
    (student['sex'].toLowerCase() !== 'male' && student['sex'].toLowerCase() !== 'female')) {
    throw new Error("Request needs sex")
  }
  if (!student['birthday']) {
    throw new Error("Request needs birthday")
  }
  if (!student['address']) {
    throw new Error("Request needs address")
  }
  if (!student['phone']) {
    throw new Error("Request needs phone")
  }
  return student
}

function updateStudentValidator(oldStudent, newStudent) {
  if (!newStudent || !Object.keys(newStudent).length) {
    throw new Error("Request needs at least an property")
  }
  let updated
  if (newStudent['student_code']) {
    updated = true
    oldStudent['student_code'] = newStudent['student_code']
  }
  if (newStudent['name']) {
    updated = true
    oldStudent['name'] = newStudent['name']
  }
  if (newStudent['class']) {
    updated = true
    oldStudent['class'] = newStudent['class']
  }
  if (newStudent['school_year']) {
    updated = true
    oldStudent['school_year'] = newStudent['school_year']
  }
  if (newStudent['email']) {
    updated = true
    oldStudent['email'] = newStudent['email']
  }
  if (newStudent['citizen_id']) {
    updated = true
    oldStudent['citizen_id'] = newStudent['citizen_id']
  }
  if ((newStudent['sex'].toLowerCase() === 'male' || newStudent['sex'].toLowerCase() === 'female')) {
    updated = true
    oldStudent['sex'] = newStudent['sex'].toLowerCase()
  }
  if (newStudent['birthday']) {
    updated = true
    oldStudent['birthday'] = newStudent['birthday']
  }
  if (newStudent['address']) {
    updated = true
    oldStudent['address'] = newStudent['address']
  }
  if (newStudent['phone']) {
    updated = true
    oldStudent['phone'] = newStudent['phone']
  }

  if (!updated) {
    throw new Error("Request needs at least an valid property")
  }
  return oldStudent
}


module.exports = {
  createStudentValidator,
  updateStudentValidator
}
