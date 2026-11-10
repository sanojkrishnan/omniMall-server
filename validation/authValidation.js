const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const strongPasswordValidation = commonPatterns.strongPasswordValidation;

const emailValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
});

const otpValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  otp: commonPatterns.otp.messages(customMessages),
});

const loginValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  password: commonPatterns.loginPassword.messages(customMessages),
});

const resetPasswordValidation = Joi.object({
  token: commonPatterns.token.messages(customMessages),
  password: strongPasswordValidation,
});

const registerValidation = Joi.object({
  firstName: commonPatterns.firstName.messages(customMessages),
  lastName: commonPatterns.lastName.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  role: commonPatterns.role.messages(customMessages),
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
  profileImage: commonPatterns.image.messages(customMessages),
});

const updateProfileValidation = Joi.object({
  firstName: commonPatterns.firstName.optional().messages(customMessages),
  lastName: commonPatterns.lastName.optional().messages(customMessages),
  dateOfBirth: commonPatterns.dateOfBirth.optional().messages(customMessages),
  gender: commonPatterns.gender.optional().messages(customMessages),
  email: commonPatterns.email.optional().messages(customMessages),
})
  .min(1)
  .messages(customMessages);

module.exports = {
  strongPasswordValidation,
  registerValidation,
  resetPasswordValidation,
  loginValidation,
  otpValidation,
  emailValidation,
  updateProfileValidation,
};
