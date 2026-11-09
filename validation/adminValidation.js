const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const {
  loginValidation,
  strongPasswordValidation,
} = require("./authValidation");

// Admin create validation
const adminCreateValidation = Joi.object({
  name: commonPatterns.name.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  status: commonPatterns.status.messages(customMessages),
});

// Admin login validation
const adminLoginValidation = loginValidation;

module.exports = {
  adminLoginValidation,
  adminCreateValidation,
};
