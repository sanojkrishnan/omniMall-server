const Joi = require("joi");
const {
  commonPatterns,
  customMessages,
  objectIdItem,
} = require("./commonMessages");
const { updateValidation } = require("./validationHelper");

const couponFetchValidation = Joi.object({
  id: commonPatterns.objectId.optional().messages(customMessages),
  page: commonPatterns.page.messages(customMessages),
  limit: commonPatterns.limit.messages(customMessages),
  search: commonPatterns.search.messages(customMessages),
  sort: commonPatterns.sort.messages(customMessages),
}).messages(customMessages);

const updateStatusValidation = Joi.object({
  id: commonPatterns.objectId.messages(customMessages),
  status: commonPatterns.couponStatus.messages(customMessages),
});

const couponValidation = Joi.object({
  name: commonPatterns.couponName.messages(customMessages),
  code: commonPatterns.couponCode.messages(customMessages),
  description: commonPatterns.couponDescription.messages(customMessages),
  discountType: commonPatterns.discountType.messages(customMessages),
  discountValue: commonPatterns.nonNegative.messages(customMessages),

  maxDiscount: Joi.number()
    .min(0)
    .when("discountType", {
      switch: [
        { is: "percentage", then: commonPatterns.nonNegative },
        { is: "flat", then: Joi.forbidden() },
      ],
    })
    .messages(customMessages),

  minOrderAmount: commonPatterns.nonNegative.messages(customMessages),

  startDate: Joi.date().required().messages(customMessages),
  endDate: Joi.date()
    .required()
    .when("startDate", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("startDate")),
    })
    .messages({
      ...customMessages,
      "date.greater": "End date must be after start date",
    }),

  usageLimit: commonPatterns.positiveInteger.messages(customMessages),
  usagePerUser: commonPatterns.positiveInteger.messages(customMessages),

  applicableProducts: commonPatterns.objectIdArray.messages(customMessages),
  applicableCategories: commonPatterns.objectIdArray.messages(customMessages),
  excludedProducts: commonPatterns.objectIdArray.messages(customMessages),
  sellerIds: commonPatterns.objectIdArray.messages(customMessages),

  eligibleUsers: commonPatterns.eligibleUsers.messages(customMessages),
  paymentMethods: commonPatterns.paymentMethods.messages(customMessages),

  stackable: commonPatterns.boolean.default(false).messages(customMessages),
  autoApply: commonPatterns.boolean.default(false).messages(customMessages),

  createdBy: commonPatterns.objectId.messages(customMessages),
}).messages(customMessages);

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
