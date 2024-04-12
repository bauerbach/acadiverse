const Validator = require("validator");
const isEmpty = require("is-empty");

let errors = ""

module.exports = function validateRegistration(data) {
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

  errors = "";

  if (Validator.isEmpty(data.username)) {
    errors += "\nPlease enter a username.";
  }

  if (Validator.isEmpty(data.email)) {
    errors += "\nPlease enter your email.";
  } else if (!Validator.isEmail(data.email)) {
    errors += "\nThe email you entered is not valid.";
  }

  if (Validator.isEmpty(data.password)) {
    errors += "\nPlease enter a password.";
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors += "\nPlease confirm your password.";
  }

  if (!Validator.isLength(data.password, { min: 8, max: 24 })) {
    errors += "\nPassword must be between 8 and 24 characters.";
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors += "\nThe passwords do not match.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}