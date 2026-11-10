const Joi = require("joi");

const customMessages = {
  "string.base": "{#label} must be a string",
  "string.empty": "{#label} is not allowed to be empty",
  "string.min": "{#label} must be at least {#limit} characters long",
  "string.max": "{#label} cannot exceed {#limit} characters",
  "string.email": "Please provide a valid email address",
  "string.length": "{#label} must be exactly {#limit} characters long",
  "string.uri": "{#label} must be a valid URL",
  "string.pattern.base": "{#label} format is invalid",
  "any.required": "{#label} is required",
  "any.only": "{#label} must be one of: {#valids}",
  "number.base": "{#label} must be a number",
  "number.integer": "{#label} must be an integer",
  "number.min": "{#label} must be at least {#limit}",
  "number.max": "{#label} cannot exceed {#limit}",
  "number.positive": "{#label} must be a positive number",
  "array.base": "{#label} must be an array",
  "array.min": "{#label} must contain at least {#limit} item(s)",
  "array.max": "{#label} cannot contain more than {#limit} item(s)",
  "array.unique": "{#label} must not contain duplicate items",
  "date.base": "{#label} must be a valid date",
  "date.greater": "{#label} must be after the specified date",
  "boolean.base": "{#label} must be true or false",
  "object.unknown": "{#label} is not allowed",
  "object.min": "At least {#limit} field(s) must be provided",
};

// Reusable regex
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

// Reusable building blocks
const objectIdItem = Joi.string().pattern(objectIdPattern);

const imageObject = Joi.object({
  url: Joi.string().uri().required(),
  publicId: Joi.string().required(),
});

const commonPatterns = {
  // Names
  name: Joi.string().min(2).max(100).trim().required(),
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),
  optionalLastName: Joi.string().allow(null).max(100).trim(),
  businessName: Joi.string().min(2).max(150).trim().required(),

  // Generic text
  text: Joi.string().trim().required(),

  // Email / auth
  email: Joi.string().email().lowercase().trim().required(),
  loginPassword: Joi.string().required(),
  otp: Joi.string().length(6).required(),
  token: Joi.string().required(),

  // MongoDB ObjectId
  objectId: Joi.string().pattern(objectIdPattern).required(),
  profileId: Joi.string().pattern(objectIdPattern).required(),
  objectIdArray: Joi.array().items(objectIdItem).default([]),
  uniqueCategories: Joi.array().items(objectIdItem).unique().default([]),
  requiredUniqueObjectIds: Joi.array()
    .items(objectIdItem)
    .single() // multipart sends one value as a string, not an array
    .min(1)
    .unique()
    .required(),

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
  image: imageObject.optional(),
  imageRequired: imageObject.required(),
  imageList: Joi.array().items(imageObject).min(1).max(10).required(),

  // Status / role / provider
  status: Joi.string().valid("active", "banned", "inactive").default("active"),
  profileStatus: Joi.string()
    .valid("active", "banned", "inactive", "incomplete")
    .default("incomplete"),
  couponStatus: Joi.string().valid("active", "inactive", "pending").required(),
  role: Joi.string().valid("user", "seller", "admin").default("user"),
  provider: Joi.string().default("google"),

  // Numbers
  quantity: Joi.number().integer().min(1).max(100).required(),
  stock: Joi.number().integer().min(0).required(),
  price: Joi.number().positive().required(),
  nonNegative: Joi.number().min(0).required(),
  positiveInteger: Joi.number().integer().min(1).required(),
  optionalInteger: Joi.number().integer().optional(),

  // Booleans
  boolean: Joi.boolean(),
  terms: Joi.boolean().valid(true).required(),

  // Pagination / search / sort
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(15),
  search: Joi.string().trim().max(100).allow("").optional(),
  sort: Joi.string().valid("newest", "oldest").default("newest"),
  priceSort: Joi.string().valid("price_asc", "price_desc").optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  idsCsv: Joi.string()
    .pattern(/^([0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*)?$/)
    .allow("")
    .optional(),
  publicId: Joi.string().trim().required(),

  // Coupon
  couponName: Joi.string().trim().min(3).max(100).required(),
  couponCode: Joi.string().trim().uppercase().min(3).max(6).required(),
  couponDescription: Joi.string().trim().min(5).max(500).required(),
  discountType: Joi.string().valid("percentage", "flat").required(),
  eligibleUsers: Joi.string().valid("all", "new", "existing").required(),
  paymentMethods: Joi.array()
    .items(Joi.string().valid("COD", "CARD", "UPI"))
    .unique()
    .default(["COD", "CARD", "UPI"]),

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