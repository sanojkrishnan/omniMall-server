const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

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

module.exports = {
  isCallForCategory,
};
