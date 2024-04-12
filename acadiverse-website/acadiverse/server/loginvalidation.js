const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLogin(data) {
  let loginErrors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.username)) {
    loginErrors.username = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    loginErrors.password = "Password field is required";
  }
  
  return {
    loginErrors,
    isValid: isEmpty(loginErrors)
  }
}