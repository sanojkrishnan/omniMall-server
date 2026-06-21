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

//resend otp validation schema
// now reuses commonPatterns.email so it gets lowercase/trim normalization
// and the shared custom messages, instead of redefining email inline
const resendOTPValidation = Joi.object({
  email: commonPatterns.email.messages(customMessages),
});

//google profile completion validation schema
// uses commonPatterns.profileId (already required) instead of the bare
// commonPatterns.objectId + an extra .required(), removing the duplication
const googleProfileCompletionValidation = Joi.object({
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
  profileId: commonPatterns.profileId.messages(customMessages),
});

//admin create validation schema
const adminCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).trim().required().messages(customMessages),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  status: commonPatterns.status.messages(customMessages),
});

//admin login validation
const adminLoginValidation = loginValidation;

//dashboard data fetch
const dashboardValidation = Joi.object({
  adminId: Joi.string().required().messages(customMessages),
});

//pagination validation schema
const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages(customMessages),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(15)
    .messages(customMessages),
});

//product validation
const productValidation = Joi.object({
  productName: Joi.string().required().messages(customMessages),
  brand: Joi.string().required().messages(customMessages),
  productDesc: Joi.string().required().messages(customMessages),
  categoryId: Joi.string().required().messages(customMessages),
  sellerId: Joi.string().required().messages(customMessages),
  couponId: Joi.string().optional().messages(customMessages),
  stock: Joi.number().integer().min(0).required().messages(customMessages),
  mrp: Joi.number().positive().required().messages(customMessages),
  offerPrice: Joi.number()
    .positive()
    .max(Joi.ref("mrp"))
    .required()
    .messages({
      ...customMessages,
      "number.max": "Offer price must be less than or equal to MRP",
    }),
  productImage: Joi.array()
    .items(
      Joi.object({
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/webp")
          .required()
          .messages({
            ...customMessages,
            "any.only": "Unsupported format (use JPEG, PNG, or WebP)",
          }),
        size: Joi.number()
          .max(2 * 1024 * 1024)
          .required()
          .messages({
            ...customMessages,
            "number.max": "Each file must be 2MB or less",
          }),
      }),
    )
    .min(1)
    .max(10)
    .required()
    .messages({
      ...customMessages,
      "array.min": "At least one product image is required",
      "array.max": "You can upload a maximum of 10 images",
      "any.required": "Product image is required",
    }),
});

//call for seller
const isCallForSeller = Joi.object({
  uniqueSellers: Joi.array()
    .items(commonPatterns.objectId)
    .min(1)
    .required()
    .messages(customMessages),
  page: Joi.number().integer().min(1).default(1).messages(customMessages),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(15)
    .messages(customMessages),
});
//call for categories
const isCallForCategory = Joi.object({
  uniqueCategories: Joi.array()
    .items(commonPatterns.objectId)
    .min(1)
    .required()
    .messages(customMessages),
  page: Joi.number().integer().min(1).default(1).messages(customMessages),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(15)
    .messages(customMessages),
});

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
  resetPasswordValidation,
  strongPasswordValidation,
  adminLoginValidation,
  loginValidation,
  adminCreateValidation,
  dashboardValidation,
  paginationValidation,
  productValidation,
  googleAuthValidation,
  googleProfileCompletionValidation,
  otpValidation,
  isCallForSeller,
  isCallForCategory,
  resendOTPValidation,
};
