const Joi = require("joi");
const { paginationValidation } = require("./paginationValidation");
const { strongPasswordValidation } = require("./authValidation");
const { customMessages, commonPatterns } = require("./commonMessages");


const validateId = Joi.object({
  id: commonPatterns.objectId.required().messages(customMessages),
});

//for updating
const updateValidation = (schema) => {
  return Joi.object({
    id: commonPatterns.objectId.required().messages(customMessages),
    data: schema.min(1).required(),
  });
};

const ValidationHelpers = {
  validatePagination: (query) => {
    const { error, value } = paginationValidation.validate(query);
    if (error) throw error;
    return value;
  },

  isValidObjectId: (id) => {
    return commonPatterns.objectId.validate(id).error === undefined;
  },

  isValidEmail: (email) => {
    return commonPatterns.email.validate(email).error === undefined;
  },

  checkPasswordStrength: (password) => {
    const { error } = strongPasswordValidation.validate(password);
    return error === undefined;
  },
};

module.exports = {
  ValidationHelpers,
  updateValidation,
  validateId,
};
