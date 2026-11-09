const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const addCartValidation = Joi.object({
  userId: commonPatterns.objectId.messages(customMessages),

  cart: Joi.array()
    .items(
      Joi.object({
        productId: commonPatterns.objectId.messages(customMessages),
        sellerId: commonPatterns.objectId.messages(customMessages),
        qnty: commonPatterns.quantity.messages(customMessages),
      }),
    )
    .min(1)
    .required()
    .messages(customMessages),
});

const removeCartValidation = Joi.object({
  userId: commonPatterns.objectId.messages(customMessages),
  productId: commonPatterns.objectId.messages(customMessages),
});

const updateCartQuantityValidation = Joi.object({
  userId: commonPatterns.objectId.messages(customMessages),
  productId: commonPatterns.objectId.messages(customMessages),
  qnty: commonPatterns.quantity.messages(customMessages),
});

module.exports = {
  updateCartQuantityValidation,
  removeCartValidation,
  addCartValidation,
};
