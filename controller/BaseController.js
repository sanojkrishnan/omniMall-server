const {
  sendSuccess,
  sendError,
  sendValidationError,
} = require("../utils/response");
const { ValidationError } = require("../utils/errors");
const logger = require("../utils/logger");

// a base class that all other controllers extend to share common functionality.
class BaseController {
  static asyncHandler(fn) {
    //this will help to avoid calling try catch in every controller and it will catch the error itself
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  // Validates request body against a Joi schema
  // If invalid, throws a ValidationError with all error messages joined
  // abortEarly: false means it collects all errors, not just the first one
  static validateRequest(schema, data) {
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      throw new ValidationError(messages, error.details);
    }

    return value;
  }

  static handleValidationError(res, error) {
    return sendValidationError(res,  error);
  }

  static sendSuccess(res, message, data = null, statusCode = 200) {
    return sendSuccess(res, message, data, statusCode);
  }
  static sendError(res, message, statusCode = 500, details = null) {
    return sendError(res, message, statusCode, details);
  }

  static logAction(action, user = null, details = {}) {
    const logData = {
      action,
      timestamp: new Date().toISOString(),
      ...details,
    };

    if (user) {
      logData.user = {
        id: user._id || user.id,
        email: user.email,
        role: user.role,
      };
    }

    logger.info(`Controller Action: ${action}`, logData);
  }

  //   Strips sensitive fields before sending user data in responses
  static sanitizeUser(user) {
    if (!user) return null;

    const sanitized = user.toObject ? user.toObject() : user;
    delete sanitized.password; // never expose this
    delete sanitized.__v; // mongoose internal field, not needed

    return sanitized;
  }
}

module.exports = BaseController;
