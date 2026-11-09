const Joi = require("joi");
const { customMessages, commonPatterns } = require("./commonMessages");

//call for seller
const isCallForSeller = Joi.object({
  uniqueSellers: Joi.array()
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

const sellerRegisterValidation = Joi.object({
  storeName: commonPatterns.businessName.messages(customMessages),
  businessEmail: commonPatterns.email.messages(customMessages),
  description: commonPatterns.description.messages(customMessages),
  businessPhone: commonPatterns.phone.messages(customMessages),
  businessAddress: commonPatterns.address.messages(customMessages),
  pickupLocation: commonPatterns.address.messages(customMessages),
  productCategories: Joi.array()
    .items(commonPatterns.objectId)
    .min(1)
    .unique()
    .required()
    .messages(customMessages),
  businessLogo: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().required(),
  })
    .required()
    .messages({
      ...customMessages,
      "any.required": "Business logo is required",
    }),
  conditionCheck: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      ...customMessages,
      "any.only": "You must agree to the terms and conditions",
      "any.required": "You must agree to the terms and conditions",
    }),
});

module.exports = {
  isCallForSeller,
  sellerRegisterValidation,
};
