function createIssuerTeacherValidator(issuerTeacher) {
  if (!issuerTeacher || !issuerTeacher['school_id']) {
    throw new Error("Request needs school_id")
  }
  if (!issuerTeacher['user_id']) {
    throw new Error("Request needs user_id")
  }
  if (!issuerTeacher['name']) {
    throw new Error("Request needs name")
  }
  if (!issuerTeacher['address']) {
    throw new Error("Request needs address")
  }
  if (!issuerTeacher['phone']) {
    throw new Error("Request needs phone")
  }
  if (!issuerTeacher['role']) {
    throw new Error("Request needs role")
  }
  return issuerTeacher
}

function getIssuerTeacherByUserValidator(issuerTeacher) {
  if (!issuerTeacher || !issuerTeacher['user_id']) {
    throw new Error("Request user_id email")
  }
  return issuerTeacher
}

function updateIssuerTeacherValidator(oldItem, newItem) {
  if (!newItem || !Object.keys(newItem).length) {
    throw new Error("Request needs at least an property")
  }
  let updated
  if (newItem['name']) {
    updated = true
    oldItem['name'] = newItem['name']
  }
  if (newItem['phone']) {
    updated = true
    oldItem['phone'] = newItem['phone']
  }
  if (newItem['address']) {
    updated = true
    oldItem['address'] = newItem['address']
  }

  if (!updated) {
    throw new Error("Request needs at least an valid property")
  }
  return oldItem
}

module.exports = {
  createIssuerTeacherValidator,
  getIssuerTeacherByUserValidator,
  updateIssuerTeacherValidator
}
