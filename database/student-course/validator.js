
function createStudentCourseValidator(studentCourse) {
  if (!studentCourse || !studentCourse['course_id']) {
    throw new Error("Request needs course_id")
  }
  if (!studentCourse['student_id']) {
    throw new Error("Request needs student_id")
  }
  if (!studentCourse['mid_term'] || isNaN(studentCourse['mid_term'])) {
    throw new Error("Request needs mid_term in number")
  }
  if (!studentCourse['last_term'] || isNaN(studentCourse['last_term'])) {
    throw new Error("Request needs last_term in number")
  }
  return studentCourse
}

function updateStudentCourseValidator(oldStudentCourse, newStudentCourse) {
  if (!newStudentCourse || !Object.keys(newStudentCourse).length) {
    throw new Error("Request needs at least an property")
  }
  let updated
  if (newStudentCourse['course_id']) {
    updated = true
    oldStudentCourse['course_id'] = newStudentCourse['course_id']
  }
  if (newStudentCourse['student_id']) {
    updated = true
    oldStudentCourse['student_id'] = newStudentCourse['student_id']
  }
  if (newStudentCourse['mid_term'] && !isNaN(newStudentCourse['mid_term'])) {
    updated = true
    oldStudentCourse['mid_term'] = newStudentCourse['mid_term']
  }
  if (newStudentCourse['last_term'] && !isNaN(newStudentCourse['last_term'])) {
    updated = true
    oldStudentCourse['last_term'] = newStudentCourse['last_term']
  }

  if (!updated) {
    throw new Error("Request needs at least an valid property")
  }
  return oldStudentCourse
}

function convertNumericToGradeLetter(numeric) {
  if (numeric >= 9.5 && numeric <= 10) {
    return "A+"
  } else if (numeric >= 8.5 && numeric < 9.5) {
    return "A"
  } else if (numeric >= 8 && numeric < 8.5) {
    return "B+"
  } else if (numeric >= 7 && numeric < 8) {
    return "B"
  } else if (numeric >= 6.5 && numeric < 7) {
    return "C+"
  } else if (numeric >= 5.5 && numeric < 6.5) {
    return "C"
  } else if (numeric >= 5 && numeric < 5.5) {
    return "D+"
  } else if (numeric >= 4 && numeric < 5) {
    return "D"
  } else if (numeric < 4) {
    return "F"
  }
}


module.exports = {
  createStudentCourseValidator,
  updateStudentCourseValidator,
  convertNumericToGradeLetter
}
