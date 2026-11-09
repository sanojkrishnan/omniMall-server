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
  "array.unique": "{#label} must not contain duplicate items",
  "date.greater": "{#label} must be after the specified date",
};

// Reusable patterns
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const objectIdItem = Joi.string().pattern(objectIdPattern);

const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

const commonPatterns = {
  // Names
  name: Joi.string().min(2).max(100).trim().required(),
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),

  businessName: Joi.string().min(2).max(150).trim().required(),

  // Email
  email: Joi.string().email().lowercase().trim().required(),

  // MongoDB ObjectId
  objectId: Joi.string().pattern(objectIdPattern).required(),
  profileId: Joi.string().pattern(objectIdPattern).required(),

  // Personal information
  dateOfBirth: Joi.date().required(),

  gender: Joi.string().valid("male", "female", "other").required(),

  // Business information
  description: Joi.string().min(10).max(500).trim().required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  address: Joi.string().min(5).max(300).trim().required(),

  // Images
  image: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
  }).optional(),

  // Status and role
  status: Joi.string().valid("active", "banned", "inactive").default("active"),

  role: Joi.string().valid("user", "seller", "admin").default("user"),

  // General
  boolean: Joi.boolean(),

  otp: Joi.string().length(6).required(),

  search: Joi.string().trim().max(100).allow("").optional(),

  sort: Joi.string().valid("newest", "oldest").default("newest"),

  token: Joi.string().required(),

  quantity: Joi.number().integer().min(1).max(100).required(),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(15),

  // Arrays
  uniqueCategories: Joi.array().items(objectIdItem).unique().default([]),

  // Password
  strongPasswordValidation: Joi.string()
    .min(8)
    .max(128)
    .pattern(strongPasswordPattern)
    .required()
    .messages({
      ...customMessages,
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
};

module.exports = {
  customMessages,
  commonPatterns,
  objectIdPattern,
  objectIdItem,
  strongPasswordPattern,
};
