const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");
const { updateValidation } = require("./validationHelper");

const isCallForCategory = Joi.object({
  uniqueCategories: commonPatterns.uniqueCategories.messages(customMessages),
  page: commonPatterns.page.messages(customMessages),
  limit: commonPatterns.limit.messages(customMessages),
});

const categoryValidation = Joi.object({
  name: commonPatterns.name.messages(customMessages),
  categoryImage: commonPatterns.imageRequired.messages({
    ...customMessages,
    "any.required": "Category image is required",
  }),
  isActive: commonPatterns.boolean.default(true).messages(customMessages),
});

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
