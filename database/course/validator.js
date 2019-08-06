
function createCourseValidator(course) {
  if (!course || !course['school_id']) {
    throw new Error("Request needs school_id")
  }
  if (!course['course_code']) {
    throw new Error("Request needs course_code")
  }
  if (!course['course_name']) {
    throw new Error("Request needs course_name")
  }
  if (!course['num_credits']) {
    throw new Error("Request needs num_credits")
  }
  if (!course['weight']) {
    throw new Error("Request needs weight")
  }
  if (!course['institute']) {
    throw new Error("Request needs institute")
  }
  return course
}

function updateCourseValidator(oldItem, newItem) {
  if (!newItem || !Object.keys(newItem).length) {
    throw new Error("Request needs at least an property")
  }
  let updated
  if (newItem['course_code']) {
    updated = true
    oldItem['course_code'] = newItem['course_code']
  }
  if (newItem['course_name']) {
    updated = true
    oldItem['course_name'] = newItem['course_name']
  }
  if (newItem['num_credits']) {
    updated = true
    oldItem['num_credits'] = newItem['num_credits']
  }
  if (newItem['weight']) {
      updated = true
      oldItem['weight'] = newItem['weight']
  }
  if (newItem['institute']) {
      updated = true
      oldItem['institute'] = newItem['institute']
  }

  if (!updated) {
    throw new Error("Request needs at least an valid property")
  }
  return oldItem
}


module.exports = {
  createCourseValidator,
  updateCourseValidator
}
