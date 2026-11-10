const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const googleProfileCompletionValidation = Joi.object({
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
  profileId: commonPatterns.profileId.messages(customMessages),
});

const googleAuthValidation = Joi.object({
  firstName: commonPatterns.firstName.messages(customMessages),
  lastName: commonPatterns.optionalLastName.messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  role: commonPatterns.role.messages(customMessages),
  profileImage: Joi.object({
    url: Joi.string().uri().allow(null),
    publicId: Joi.string().allow(null),
  })
    .optional()
    .messages(customMessages),
  provider: commonPatterns.provider.messages(customMessages),
  status: commonPatterns.profileStatus.messages(customMessages),
});

module.exports = {
  googleProfileCompletionValidation,
  googleAuthValidation,
};
