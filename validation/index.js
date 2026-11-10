const { customMessages } = require("./commonMessages");

// One place to import every schema and shared pattern
module.exports = {
  ...require("./commonMessages"),
  ...require("./validationHelper"),
  ...require("./authValidation"),
  ...require("./adminValidation"),
  ...require("./cartValidation"),
  ...require("./categoryValidation"),
  ...require("./couponValidation"),
  ...require("./googleValidation"),
  ...require("./paginationValidation"),
  ...require("./productValidation"),
  ...require("./sellerValidation"),

  // Shared validate() so every route uses identical options + messages
  validate: (schema, data) => {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      messages: customMessages,
    });
    if (error) {
      error.details = error.details.map((d) => ({ ...d, message: d.message }));
      throw error;
    }
    return value;
  },
};
