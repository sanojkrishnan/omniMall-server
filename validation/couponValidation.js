const { paginationValidation } = require("./paginationValidation");

const couponValidation = Joi.object({
  id: validateId,
  pagination: paginationValidation,
});

module.exports = {
  couponValidation,
};
