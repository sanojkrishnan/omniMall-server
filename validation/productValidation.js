const Joi = require("joi");
const { updateValidation } = require("./validationHelper");
const { customMessages, commonPatterns } = require("./commonMessages");

const productValidation = Joi.object({
  productName: commonPatterns.text.messages(customMessages),
  brand: commonPatterns.text.messages(customMessages),
  productDesc: commonPatterns.text.messages(customMessages),
  categoryId: commonPatterns.objectId.messages(customMessages),
  sellerId: commonPatterns.objectId.messages(customMessages),
  couponId: commonPatterns.objectId
    .allow("")
    .optional()
    .messages(customMessages),
  stock: commonPatterns.stock.messages(customMessages),
  mrp: commonPatterns.price.messages(customMessages),
  offerPrice: commonPatterns.price
    .when("mrp", {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref("mrp")),
    })
    .messages({
      ...customMessages,
      "number.max": "Offer price must be less than or equal to MRP",
    }),
  offerPercentage: commonPatterns.optionalInteger.messages(customMessages),
  productImage: commonPatterns.imageList.messages({
    ...customMessages,
    "array.min": "At least one product image is required",
    "array.max": "You can upload a maximum of 10 images",
    "any.required": "Product image is required",
  }),
});

const productUpdateValidation = updateValidation(
  productValidation.fork(
    [
      "productName",
      "brand",
      "productDesc",
      "categoryId",
      "sellerId",
      "couponId",
      "stock",
      "mrp",
      "offerPrice",
      "offerPercentage",
      "productImage",
    ],
    (schema) => schema.optional(),
  ),
);

// publicId for change / delete a single product image
const productImagePublicIdValidation = Joi.object({
  id: commonPatterns.objectId.messages(customMessages),
  publicId: commonPatterns.publicId.messages(customMessages),
});

module.exports = {
  productImagePublicIdValidation,
  productValidation,
  productUpdateValidation,
};
