const Joi = require("joi");

const commonPatterns = {
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  status: Joi.string().valid("active", "banned", "inactive"),
  role: Joi.string().valid("user", "seller", "admin").default("user"),
};
const customMessages = {
  "string.min": "{#label} must be at least {#limit} characters long",
  "string.max": "{#label} cannot exceed {#limit} characters",
  "string.email": "Please provide a valid email address",
  "any.required": "{#label} is required",
  "any.only": "{#label} must be one of: {#valids}",
  "string.pattern.base": "{#label} format is invalid",
};

const strongPasswordValidation = Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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
//otp validation schema
const otpValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  otp: Joi.string().length(6).required().messages(customMessages),
});
//login validation schema
const loginValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
  password: Joi.string().required().messages(customMessages),
});


//admin create validation schema
const adminCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
});
//admin login validation 
const adminLoginValidation = loginValidation;
//pagination validation schema
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
  registerValidation,
  ValidationHelpers,
  commonPatterns,
  customMessages,
  strongPasswordValidation,
  adminLoginValidation,
  loginValidation,
  adminCreateValidation,
  otpValidation,
};
