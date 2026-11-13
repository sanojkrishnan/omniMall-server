const Joi = require("joi");
const { commonPatterns, customMessages } = require("./commonMessages");

const addressValidation = Joi.object({
  name: commonPatterns.name.messages(customMessages),
  label: commonPatterns.label.messages(customMessages),
  phone: commonPatterns.phone.messages(customMessages),
  line1: commonPatterns.address.messages(customMessages),
  line2: commonPatterns.addressOptional.messages(customMessages),
  city: commonPatterns.city.messages(customMessages),
  state: commonPatterns.state.messages(customMessages),
  pincode: commonPatterns.pincode.messages(customMessages),
  isDefault: commonPatterns.boolean.default(false),
});

module.exports = {
  addressValidation,
};
