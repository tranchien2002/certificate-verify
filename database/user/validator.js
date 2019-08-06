const values = require("lodash/values")
const USER_ROLE = require("./common").USER_ROLE

function createUserValidator(user) {
  if (!user['email']) {
    throw new Error("Request needs email")
  }
  if (!user['password']) {
    throw new Error("Request needs password")
  }
  const roles = values(USER_ROLE)
  if (!roles.includes(user['role'])) {
    throw new Error("Request needs role in " + roles.toString())
  }
  return user
}

function getUserByEmailPasswordValidator(user) {
  if (!user || !user['email']) {
    throw new Error("Request needs email")
  }
  if (!user['password']) {
    throw new Error("Request needs password")
  }
  return user
}

module.exports = {
  createUserValidator,
  getUserByEmailPasswordValidator
}
