
function createDegreeValidator(degree) {
  if (!degree && !degree['school_id']) {
    throw new Error("Request needs school_id")
  }
  if (!degree['name']) {
    throw new Error("Request needs name")
  }
  if (!degree['degree_type']) {
    throw new Error("Request needs degree_type")
  }
  if (!degree['courses']) {
    throw new Error("Request needs courses")
  }
  if (!degree['institute']) {
    throw new Error("Request needs institute")
  }
  return degree
}

function updateDegreeValidator(oldDegree, newDegree) {
  if (newDegree['school_id'] && newDegree['school_id'] !== oldDegree['school_id']) {
    throw new Error("Cannot update degree to another school")
  }
  if (newDegree['name']) {
    oldDegree['name'] = newDegree['name']
  }
  if (newDegree['degree_type']) {
    oldDegree['degree_type'] = newDegree['degree_type']
  }
  if (newDegree['courses']) {
    oldDegree['courses'] = newDegree['courses']
  }
  if (!newDegree['institute']) {
    oldDegree['institute'] = newDegree['institute']
  }
  return oldDegree
}

module.exports = {
  createDegreeValidator,
  updateDegreeValidator
}
