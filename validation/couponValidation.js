const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");
const { updateValidation } = require("./validationHelper");

const couponFetchValidation = Joi.object({
  id: commonPatterns.objectId.required().messages(customMessages),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(15),
  search: Joi.string().trim().max(100).allow("").optional(),
  sort: Joi.string().valid("newest", "oldest").default("newest"),
}).messages(customMessages);

const updateStatusValidation = Joi.object({
  id: commonPatterns.objectId.required().messages(customMessages),
  status: Joi.string()
    .valid("active", "inactive", "pending")
    .messages(customMessages),
});

const couponValidation = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages(customMessages),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(3)
    .max(30)
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

  status: Joi.string()
    .valid("active", "inactive", "pending")
    .default("pending")
    .messages(customMessages),

  usageLimit: Joi.number().integer().min(1).required().messages(customMessages),

  usagePerUser: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages(customMessages),

  applicableProducts: Joi.array()
    .items(commonPatterns.objectId)
    .default([])
    .messages(customMessages),

  applicableCategories: Joi.array()
    .items(commonPatterns.objectId)
    .default([])
    .messages(customMessages),

  excludedProducts: Joi.array()
    .items(commonPatterns.objectId)
    .default([])
    .messages(customMessages),

  sellerIds: Joi.array()
    .items(commonPatterns.objectId)
    .default([])
    .messages(customMessages),

  eligibleUsers: Joi.string()
    .valid("all", "new", "existing")
    .required()
    .messages(customMessages),

  paymentMethods: Joi.array()
    .items(Joi.string().valid("COD", "CARD", "UPI"))
    .default(["COD", "CARD", "UPI"])
    .messages(customMessages),

  stackable: Joi.boolean().default(false).messages(customMessages),

  autoApply: Joi.boolean().default(false).messages(customMessages),

  createdBy: commonPatterns.objectId.required().messages(customMessages),
}).messages(customMessages);

const couponUpdateValidation = updateValidation(
  couponValidation
    .fork(
      [
        "name",
        "code",
        "description",
        "discountType",
        "discountValue",
        "minOrderAmount",
        "startDate",
        "endDate",
        "status",
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
    )
    .keys({
      maxDiscount: Joi.number().min(0).allow(null).optional(),
    }),
);

module.exports = {
  couponFetchValidation,
  couponUpdateValidation,
  updateStatusValidation,
  couponValidation,
};
