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
  businessLogo: commonPatterns.imageRequired.messages(customMessages),
  businessAddress: commonPatterns.address.messages(customMessages),
  pickupLocation: commonPatterns.address.messages(customMessages),
  productCategories:
    commonPatterns.requiredUniqueObjectIds.messages(customMessages),
  conditionCheck: commonPatterns.terms.messages({
    ...customMessages,
    "any.only": "You must agree to the terms and conditions",
    "any.required": "You must agree to the terms and conditions",
  }),
});

// Same rules as register, but every field optional and no terms.
const sellerUpdateValidation = sellerRegisterValidation
  .fork(
    [
      "storeName",
      "businessEmail",
      "description",
      "businessPhone",
      "businessLogo",
      "businessAddress",
      "pickupLocation",
      "productCategories",
    ],
    (schema) => schema.optional(),
  )
  .fork(["conditionCheck"], (schema) => schema.forbidden());

module.exports = {
  isCallForSeller,
  sellerRegisterValidation,
  sellerUpdateValidation,
};
