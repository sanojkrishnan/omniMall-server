const Joi = require("joi");
const { paginationValidation } = require("./paginationValidation");
const { strongPasswordValidation } = require("./authValidation");
const { customMessages } = require("./commonMessages");

const commonPatterns = {
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  dateOfBirth: Joi.date().required(),
  profileImage: Joi.object({
    url: Joi.string().uri(),
    publicId: Joi.string(),
  }).optional(),
  gender: Joi.string().valid("male", "female", "other").required(),
  status: Joi.string().valid("active", "banned", "inactive").default("active"),
  role: Joi.string().valid("user", "seller", "admin").default("user"),
  isVerified: Joi.boolean().default(false),
  profileId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const validateId = Joi.object({
  id: commonPatterns.objectId.required().messages(customMessages),
});

//for updating
const updateValidation = (schema) => {
  return Joi.object({
    id: commonPatterns.objectId.required().messages(customMessages),
    data: schema.min(1).required(),
  });
};

const ValidationHelpers = {
  validatePagination: (query) => {
    const { error, value } = paginationValidation.validate(query);
    if (error) throw error;
    return value;
  },

  isValidObjectId: (id) => {
    return commonPatterns.objectId.validate(id).error === undefined;
  },

  isValidEmail: (email) => {
    return commonPatterns.email.validate(email).error === undefined;
  },

  checkPasswordStrength: (password) => {
    const { error } = strongPasswordValidation.validate(password);
    return error === undefined;
  },
};

module.exports = {
  ValidationHelpers,
  updateValidation,
  validateId,
  commonPatterns,
  customMessages,
};
