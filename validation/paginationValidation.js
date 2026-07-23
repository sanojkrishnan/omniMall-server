const Joi = require("joi");
const { customMessages } = require("./validationHelper");

//pagination validation schema
const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages(customMessages),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(15)
    .messages(customMessages),

  // Search
  search: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages(customMessages),

  // Category filter — must be a valid ObjectId if provided
  category: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional()
    .messages(customMessages),
  priceSort: Joi.string().valid("price_asc", "price_desc").optional(),
  // Price range
  minPrice: Joi.number().min(0).optional().messages(customMessages),
  maxPrice: Joi.number().min(0).optional().messages(customMessages),
  isFeatured: Joi.boolean().optional().messages(customMessages),
  ids: Joi.string().allow("").optional(),
  // Sort
  sort: Joi.string()
    .valid("price_asc", "price_desc", "newest", "oldest")
    .default("newest")
    .optional()
    .messages(customMessages),
});

module.exports = {
  paginationValidation,
};
