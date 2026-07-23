const Joi = require("joi");
const { commonPatterns, customMessages } = require("./validationHelper");

//add cart validation
const addCartValidation = Joi.object({
  userId: commonPatterns.objectId.required().messages(customMessages),
  cart: Joi.array()
    .items(
      Joi.object({
        productId: commonPatterns.objectId.required().messages(customMessages),
        sellerId: commonPatterns.objectId.required().messages(customMessages),
        qnty: Joi.number()
          .integer()
          .min(1)
          .max(10)
          .required()
          .messages(customMessages),
      }),
    )
    .min(1)
    .required()
    .messages(customMessages),
});

//remove cart validation
const removeCartValidation = Joi.object({
  userId: commonPatterns.objectId.required().messages(customMessages),
  productId: commonPatterns.objectId.required().messages(customMessages),
});

// update cart quantity validation
const updateCartQuantityValidation = Joi.object({
  userId: commonPatterns.objectId.required().messages(customMessages),
  productId: commonPatterns.objectId.required().messages(customMessages),
  qnty: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .required()
    .messages(customMessages),
});

module.exports = {
  updateCartQuantityValidation,
  removeCartValidation,
  addCartValidation,
};
