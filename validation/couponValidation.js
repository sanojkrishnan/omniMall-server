const Joi = require("joi");
const { commonPatterns, customMessages } = require("./validationHelper");
const { paginationValidation } = require("./paginationValidation");

const couponValidation = Joi.object({
  id: commonPatterns.objectId.required().messages(customMessages),
  pagination: paginationValidation,
});

module.exports = {
  couponValidation,
};