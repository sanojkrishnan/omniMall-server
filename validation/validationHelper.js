const Joi = require("joi");

const customMessages = {
  "string.min": "{#label} must be at least {#limit} characters long",
  "string.max": "{#label} cannot exceed {#limit} characters",
  "string.email": "Please provide a valid email address",
  "string.length": "{#label} must be exactly {#limit} characters long",
  "string.uri": "{#label} must be a valid URL",
  "any.required": "{#label} is required",
  "any.only": "{#label} must be one of: {#valids}",
  "string.pattern.base": "{#label} format is invalid",
  "number.base": "{#label} must be a number",
  "number.integer": "{#label} must be an integer",
  "number.min": "{#label} must be at least {#limit}",
  "number.max": "{#label} cannot exceed {#limit}",
  "number.positive": "{#label} must be a positive number",
  "array.min": "{#label} must contain at least {#limit} item(s)",
  "array.max": "{#label} cannot contain more than {#limit} item(s)",
};

const commonPatterns = {
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  dateOfBirth: Joi.date().required(),
  // .uri() added so profileImage.url is validated consistently everywhere it's used
  profileImage: Joi.object({
    url: Joi.string().uri(),
    publicId: Joi.string(),
  }).optional(),
  gender: Joi.string().valid("male", "female", "other").required(),
  // default("active") added — previously had no required()/default(), so it
  // silently passed through as undefined when omitted
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
