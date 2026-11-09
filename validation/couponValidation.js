const Joi = require("joi");
const {
  commonPatterns,
  customMessages,
  objectIdItem,
} = require("./commonMessages");

const { updateValidation } = require("./validationHelper");

// Coupon fetch
const couponFetchValidation = Joi.object({
  id: commonPatterns.objectId.optional().messages(customMessages),
  page: commonPatterns.page.messages(customMessages),
  limit: commonPatterns.limit.messages(customMessages),
  search: commonPatterns.search.messages(customMessages),
  sort: commonPatterns.sort.messages(customMessages),
}).messages(customMessages);

// Update coupon status
const updateStatusValidation = Joi.object({
  id: commonPatterns.objectId.messages(customMessages),

  status: Joi.string()
    .valid("active", "inactive", "pending")
    .required()
    .messages(customMessages),
});

// Coupon create
const couponValidation = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages(customMessages),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(6)
    .required()
    .messages(customMessages),

  description: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages(customMessages),

  discountType: Joi.string()
    .valid("percentage", "flat")
    .required()
    .messages(customMessages),

  discountValue: Joi.number().min(0).required().messages(customMessages),

  maxDiscount: Joi.number()
    .min(0)
    .when("discountType", {
      is: "percentage",
      then: Joi.number().min(0).required(),
      otherwise: Joi.forbidden(),
    })
    .messages(customMessages),

  minOrderAmount: Joi.number().min(0).required().messages(customMessages),

  startDate: Joi.date().required().messages(customMessages),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required()
    .messages({
      ...customMessages,
      "date.greater": "End date must be after start date",
    }),

  usageLimit: Joi.number().integer().min(1).required().messages(customMessages),

  usagePerUser: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages(customMessages),

  applicableProducts: Joi.array()
    .items(objectIdItem)
    .default([])
    .messages(customMessages),

  applicableCategories: Joi.array()
    .items(objectIdItem)
    .default([])
    .messages(customMessages),

  excludedProducts: Joi.array()
    .items(objectIdItem)
    .default([])
    .messages(customMessages),

  sellerIds: Joi.array()
    .items(objectIdItem)
    .default([])
    .messages(customMessages),

  eligibleUsers: Joi.string()
    .valid("all", "new", "existing")
    .required()
    .messages(customMessages),

  paymentMethods: Joi.array()
    .items(Joi.string().valid("COD", "CARD", "UPI"))
    .unique()
    .default(["COD", "CARD", "UPI"])
    .messages(customMessages),

  stackable: Joi.boolean().default(false).messages(customMessages),

  autoApply: Joi.boolean().default(false).messages(customMessages),

  createdBy: commonPatterns.objectId.messages(customMessages),
}).messages(customMessages);

// Coupon update
const couponUpdateValidation = updateValidation(
  couponValidation.fork(
    [
      "name",
      "code",
      "description",
      "discountType",
      "discountValue",
      "maxDiscount",
      "minOrderAmount",
      "startDate",
      "endDate",
      "usageLimit",
      "usagePerUser",
      "applicableProducts",
      "applicableCategories",
      "excludedProducts",
      "sellerIds",
      "eligibleUsers",
      "paymentMethods",
      "stackable",
      "autoApply",
      "createdBy",
    ],
    (schema) => schema.optional(),
  ),
);

module.exports = {
  couponFetchValidation,
  couponUpdateValidation,
  updateStatusValidation,
  couponValidation,
};
