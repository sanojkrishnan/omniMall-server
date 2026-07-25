const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const couponValidation = Joi.object({
  id: commonPatterns.objectId.required().messages(customMessages),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(15),
  search: Joi.string().trim().max(100).allow("").optional(),
  sort: Joi.string().valid("newest", "oldest").default("newest"),
}).messages(customMessages);

module.exports = {
  couponValidation,
};
