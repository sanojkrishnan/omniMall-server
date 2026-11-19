// validation/orderValidation.js
const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

// must match the frontend PAYMENT_METHODS (config/app)
const PAYMENT_METHODS = ["card", "upi", "wallet", "netBanking", "cod"];

const orderItemSchema = Joi.object({
  productId: commonPatterns.objectId.label("Product"),
  quantity: commonPatterns.quantity.max(10).label("Quantity"),
  variant: Joi.object({
    size: Joi.string().trim().allow(""),
    color: Joi.string().trim().allow(""),
  }).optional(),
});

const placeOrderSchema = Joi.object({
  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .unique("productId")
    .required()
    .label("Items"),
  addressId: commonPatterns.objectId.label("Delivery address"),

  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required()
    .label("Payment method"),

  // commonPatterns.couponCode is required, so make it optional here:
  // "" becomes undefined, null is allowed, default is null
  couponCode: commonPatterns.couponCode
    .optional()
    .empty("")
    .allow(null)
    .default(null)
    .label("Coupon code"),

  notes: Joi.string().trim().max(300).allow("").default("").label("Notes"),
}).messages(customMessages);

module.exports = { placeOrderSchema, PAYMENT_METHODS };
