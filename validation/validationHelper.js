const Joi = require("joi");
const { paginationValidation } = require("./paginationValidation");
const { strongPasswordValidation } = require("./authValidation");
const { commonPatterns, customMessages } = require("./commonMessages");

const validateId = Joi.object({
  id: commonPatterns.objectId.messages(customMessages),
});

// Reusable update validation: { id, data: <at least one field> }
const updateValidation = (schema) =>
  Joi.object({
    id: commonPatterns.objectId.messages(customMessages),
    data: schema.min(1).required().messages(customMessages),
  }).prefs({ noDefaults: true }); // partial updates must not inject create-time defaults

const ValidationHelpers = {
  validatePagination: (query) => {
    const { error, value } = paginationValidation.validate(query);
    if (error) throw error;
    return value;
  },
  isValidObjectId: (id) =>
    commonPatterns.objectId.validate(id).error === undefined,
  isValidEmail: (email) =>
    commonPatterns.email.validate(email).error === undefined,
  checkPasswordStrength: (password) =>
    strongPasswordValidation.validate(password).error === undefined,
};

module.exports = {
  ValidationHelpers,
  updateValidation,
  validateId,
};