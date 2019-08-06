
function createDegreeCourseValidator(studentCourse) {
  if (!studentCourse || !studentCourse['degree_id']) {
    throw new Error("Request needs degree_id")
  }
  if (!studentCourse['course_id']) {
    throw new Error("Request needs course_id")
  }
  return studentCourse
}

function updateDegreeCourseValidator(oldDegreeCourse, newDegreeCourse) {
  if (!newDegreeCourse || !Object.keys(newDegreeCourse).length) {
    throw new Error("Request needs at least an property")
  }
  let updated
  if (newDegreeCourse['course_id']) {
    updated = true
    oldDegreeCourse['course_id'] = newDegreeCourse['course_id']
  }
  if (newDegreeCourse['degree_id']) {
    updated = true
    oldDegreeCourse['degree_id'] = newDegreeCourse['degree_id']
  }
  if (!updated) {
    throw new Error("Request needs at least an valid property")
  }

  return oldDegreeCourse
}


module.exports = {
  createDegreeCourseValidator,
  updateDegreeCourseValidator
}
