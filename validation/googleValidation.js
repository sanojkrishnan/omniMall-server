const Joi = require("joi");
const { commonPatterns, customMessages } = require("./validationHelper");

//google profile completion validation schema
// uses commonPatterns.profileId (already required) instead of the bare
// commonPatterns.objectId + an extra .required(), removing the duplication
const googleProfileCompletionValidation = Joi.object({
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
  profileId: commonPatterns.profileId.messages(customMessages),
});

//google auth validation schema
const googleAuthValidation = Joi.object({
  firstName: commonPatterns.firstName.messages(customMessages),
  lastName: Joi.string().allow(null).max(100).trim().messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  role: commonPatterns.role.messages(customMessages),
  profileImage: Joi.object({
    url: Joi.string().uri().allow(null),
    publicId: Joi.string().allow(null),
  })
    .optional()
    .messages(customMessages),
  provider: Joi.string().default("google").messages(customMessages),
  status: Joi.string()
    .valid("active", "banned", "inactive", "incomplete")
    .default("incomplete")
    .messages(customMessages),
});
