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

const ORDER_ID_REGEX =
  /^OM_([A-Z]{2})([A-Z]{2})(\d{4})(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{2})(\d{13})$/;
//   │   │    │        │      │                  │                │       │
//   │   │    │        │      │                  │                │       └ time (13 digits)
//   │   │    │        │      │                  │                └ year (YY)
//   │   │    │        │      │                  └ month (MM)
//   │   │    │        │      └ day (DD)
//   │   │    │        └ last 4 digits of PIN
//   │   │    └ state code
//   │   └ country code
//   └ OmniMall prefix

const orderIdValidation = Joi.string()
  .length(30)
  .pattern(ORDER_ID_REGEX)
  .custom((value, helpers) => {
    // check the date part is a real calendar date (e.g. rejects 310226)
    const [, , , , dd, mm, yy] = value.match(ORDER_ID_REGEX);
    const d = new Date(2000 + Number(yy), Number(mm) - 1, Number(dd));
    if (d.getDate() !== Number(dd) || d.getMonth() !== Number(mm) - 1) {
      return helpers.error("orderId.invalidDate");
    }
    return value;
  })
  .required()
  .messages({
    "string.length": "Order ID must be 30 characters long",
    "string.pattern.base": "Order ID configuration is not right",
    "orderId.invalidDate": "Order ID contains an invalid date",
    "any.required": "Order ID is required",
  });

module.exports = { placeOrderSchema, PAYMENT_METHODS, orderIdValidation };
