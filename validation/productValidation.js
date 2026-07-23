const Joi = require("joi");
const {
  commonPatterns,
  customMessages,
  updateValidation,
} = require("./validationHelper");

//product validation
const productValidation = Joi.object({
  productName: Joi.string().required().messages(customMessages),
  brand: Joi.string().required().messages(customMessages),
  productDesc: Joi.string().required().messages(customMessages),
  categoryId: commonPatterns.objectId.required(),
  sellerId: commonPatterns.objectId.required(),
  couponId: commonPatterns.objectId.allow("").optional(),
  stock: Joi.number().integer().min(0).required().messages(customMessages),
  mrp: Joi.number().positive().required().messages(customMessages),
  offerPrice: Joi.number()
    .positive()
    .max(Joi.ref("mrp"))
    .required()
    .messages({
      ...customMessages,
      "number.max": "Offer price must be less than or equal to MRP",
    }),
  offerPercentage: Joi.number().integer().optional().messages(customMessages),
  productImage: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        publicId: Joi.string().required(),
      }),
    )
    .min(1)
    .max(10)
    .required()
    .messages({
      ...customMessages,
      "array.min": "At least one product image is required",
      "array.max": "You can upload a maximum of 10 images",
      "any.required": "Product image is required",
    }),
});

//product update validation
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

module.exports = {
  productValidation,
  productUpdateValidation,
};
