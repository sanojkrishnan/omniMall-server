const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

// Strong password validation
const strongPasswordValidation = commonPatterns.strongPasswordValidation;

// Email validation
const emailValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
});

// OTP validation
const otpValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  otp: commonPatterns.otp.messages(customMessages),
});

// Login validation
const loginValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),

  password: Joi.string().required().messages(customMessages),
});

// Reset password validation
const resetPasswordValidation = Joi.object({
  token: commonPatterns.token.messages(customMessages),

  password: strongPasswordValidation,
});

// Registration validation
const registerValidation = Joi.object({
  firstName: commonPatterns.firstName.messages(customMessages),
  lastName: commonPatterns.lastName.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  role: commonPatterns.role.messages(customMessages),
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
});

// Update profile validation
const updateProfileValidation = Joi.object({
  firstName: commonPatterns.firstName.optional().messages(customMessages),
  lastName: commonPatterns.lastName.optional().messages(customMessages),
  dateOfBirth: commonPatterns.dateOfBirth.optional().messages(customMessages),
  gender: commonPatterns.gender.optional().messages(customMessages),
  email: commonPatterns.email.optional().messages(customMessages),
}).min(1);

module.exports = {
  strongPasswordValidation,
  registerValidation,
  resetPasswordValidation,
  loginValidation,
  otpValidation,
  emailValidation,
  updateProfileValidation,
};
