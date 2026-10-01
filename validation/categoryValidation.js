const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");
const { updateValidation } = require("./validationHelper");

//call for categories
const isCallForCategory = Joi.object({
  uniqueCategories: Joi.array()
    .items(commonPatterns.objectId)
    .min(0)
    .optional()
    .default([])
    .messages(customMessages),
  page: Joi.number().integer().min(1).default(1).messages(customMessages),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(15)
    .messages(customMessages),
});

const categoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(60).required().messages(customMessages),
  categoryImage: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
  })
    .required()
    .messages(customMessages),
  isActive: Joi.boolean().default(true).messages(customMessages),
});

//category update validation
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
