
function createSchoolValidator(school) {
  if (!school || !school['user_id']) {
    throw new Error("Request needs user_id")
  }
  if (!school['name']) {
    throw new Error("Request needs name")
  }
  if (!school['admin_name']) {
    throw new Error("Request needs admin_name")
  }
  if (!school['address']) {
    throw new Error("Request needs address")
  }
  return school
}

function getSchoolByEmailPasswordValidator(school) {
  if (!school || !school['email']) {
    throw new Error("Request needs email")
  }
  if (!school['password']) {
    throw new Error("Request needs password")
  }
  return school
}

module.exports = {
  createSchoolValidator,
  getSchoolByEmailPasswordValidator
}
