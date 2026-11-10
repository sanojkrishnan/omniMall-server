const Joi = require("joi");
const { customMessages, commonPatterns } = require("./commonMessages");

const isCallForSeller = Joi.object({
  uniqueSellers: commonPatterns.uniqueCategories.messages(customMessages),
  page: commonPatterns.page.messages(customMessages),
  limit: commonPatterns.limit.messages(customMessages),
});

const sellerRegisterValidation = Joi.object({
  storeName: commonPatterns.businessName.messages(customMessages),
  businessEmail: commonPatterns.email.messages(customMessages),
  description: commonPatterns.description.messages(customMessages),
  businessPhone: commonPatterns.phone.messages(customMessages),
  businessAddress: commonPatterns.address.messages(customMessages),
  pickupLocation: commonPatterns.address.messages(customMessages),
  productCategories:
    commonPatterns.requiredUniqueObjectIds.messages(customMessages),
  businessLogo: commonPatterns.imageRequired.messages({
    ...customMessages,
    "any.required": "Business logo is required",
  }),
  conditionCheck: commonPatterns.terms.messages({
    ...customMessages,
    "any.only": "You must agree to the terms and conditions",
    "any.required": "You must agree to the terms and conditions",
  }),
});

module.exports = {
  isCallForSeller,
  sellerRegisterValidation,
};