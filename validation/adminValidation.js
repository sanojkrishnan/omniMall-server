const Joi = require("joi");
const { loginValidation } = require("./authValidation");

//admin create validation schema
const adminCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  status: commonPatterns.status.messages(customMessages),
});

//admin login validation
const adminLoginValidation = loginValidation;

module.exports = {
  adminLoginValidation,
  adminCreateValidation,
};
