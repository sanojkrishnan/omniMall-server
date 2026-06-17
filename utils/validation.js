const Joi = require("joi");

const commonPatterns = {
  firstName: Joi.string().min(2).max(100).trim().required(),
  lastName: Joi.string().min(2).max(100).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required(),
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  dateOfBirth: Joi.date().required(),
  profileImage: Joi.object({
    url: Joi.string(),
    publicId: Joi.string(),
  }).optional(),
  gender: Joi.string().valid("male", "female", "other").required(),
  status: Joi.string().valid("active", "banned", "inactive"),
  role: Joi.string().valid("user", "seller", "admin").default("user"),
  isVerified: Joi.boolean().default(false),
  profileId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
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
  }).optional(),
  provider: Joi.string().default("google"),
  status: Joi.string()
    .valid("active", "banned", "inactive", "incomplete")
    .default("incomplete"),
});
//resent otp validation schema
const resendOTPValidation = Joi.object({
  email: Joi.string().email().required(),
});
//google profile completion validation schema
const googleProfileCompletionValidation = Joi.object({
  dateOfBirth: commonPatterns.dateOfBirth.messages(customMessages),
  gender: commonPatterns.gender.messages(customMessages),
  profileId: commonPatterns.objectId.messages(customMessages),
});

//admin create validation schema
const adminCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  email: commonPatterns.email.messages(customMessages),
  password: strongPasswordValidation,
  status: commonPatterns.status.messages(customMessages),
});
//admin login validation
const adminLoginValidation = loginValidation;

//dashboard data fetch
const dashboardValidation = Joi.object({
  adminId: Joi.string().required(),
});
//pagination validation schema
const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
//product validation
const productValidation = Joi.object({
  productName: Joi.string().required(),
  brand: Joi.string().required(),
  productDesc: Joi.string().required(),
  categoryId: Joi.string().required(),
  sellerId: Joi.string().required(),
  couponId: Joi.string().optional(),
  stock: Joi.number().integer().min(0).required(),
  mrp: Joi.number().positive().required(),
  offerPrice: Joi.number().positive().max(Joi.ref("mrp")).required().messages({
    "number.max": "Offer price must be less than or equal to MRP",
  }),
  productImage: Joi.array()
    .items(
      Joi.object({
        mimetype: Joi.string()
          .valid("image/jpeg", "image/png", "image/webp")
          .required()
          .messages({
            "any.only": "Unsupported format (use JPEG, PNG, or WebP)",
          }),
        size: Joi.number()
          .max(2 * 1024 * 1024)
          .required()
          .messages({
            "number.max": "Each file must be 2MB or less",
          }),
      }),
    )
    .min(1)
    .max(10)
    .required()
    .messages({
      "array.min": "At least one product image is required",
      "array.max": "You can upload a maximum of 10 images",
      "any.required": "Product image is required",
    }),
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
  resendOTPValidation,
};
