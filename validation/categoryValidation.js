const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");
const { updateValidation } = require("./validationHelper");

// Fetch categories
const isCallForCategory = Joi.object({
  uniqueCategories: commonPatterns.uniqueCategories.messages(customMessages),
  page: commonPatterns.page.messages(customMessages),
  limit: commonPatterns.limit.messages(customMessages),
});

// Create category
const categoryValidation = Joi.object({
  name: commonPatterns.name.messages(customMessages),

  categoryImage: commonPatterns.image.required().messages(customMessages),

  isActive: commonPatterns.boolean.default(true).messages(customMessages),
});

// Update category
const categoryUpdateValidation = updateValidation(
  categoryValidation.fork(["name", "categoryImage", "isActive"], (schema) =>
    schema.optional(),
  ),
);

module.exports = {
  isCallForCategory,
  categoryUpdateValidation,
  categoryValidation,
};
