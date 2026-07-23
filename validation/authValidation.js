const Joi = require("joi");
const { commonPatterns, customMessages } = require("./validationHelper");

//resent otp validation
const resendOTPValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
});

//otp validation schema
const otpValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  otp: Joi.string().length(6).required().messages(customMessages),
});

//login validation schema
// Intentionally uses plain required() rather than strongPasswordValidation:
// strength is enforced at registration time, login only needs to confirm a
// password was submitted.
const loginValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  password: Joi.string().required().messages(customMessages),
});

//reset password validation schema
const resetPasswordValidation = Joi.object({
  token: Joi.string().required().messages(customMessages),
  password: strongPasswordValidation,
});

//registration validation schema
const registerValidation = Joi.object({
  firstName: commonPatterns.firstName.messages(customMessages),
  lastName: commonPatterns.lastName.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  role: commonPatterns.role.messages(customMessages),
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
});

const strongPasswordValidation = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
  .required()
  .messages({
    ...customMessages,
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  });

module.exports = {
  strongPasswordValidation,
  registerValidation,
  resetPasswordValidation,
  loginValidation,
  otpValidation,
  resendOTPValidation,
};
