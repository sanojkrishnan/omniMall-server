const jwt = require("jsonwebtoken");
const logger = require("./logger");
const config = require("../config/config");

// generate user token

const generateUserToken = (payload) => {
  try {
    return jwt.sign(payload, config.JWT_SECRET.USER_SECRET, {
      expiresIn: config.JWT_SECRET.EXPIRE_IN,
    });
  } catch (error) {
    logger.error("Error generating user token:", error);
    throw new Error("Token generation failed");
  }
};

//generate admin token

const generateAdminToken = (payload) => {
  try {
    console.log("SIGN SECRET:", config.JWT_SECRET.ADMIN_SECRET);
    return jwt.sign(payload, config.JWT_SECRET.ADMIN_SECRET, {
      expiresIn: config.JWT_SECRET.EXPIRE_IN,
    });
  } catch (error) {
    logger.error("Error generating admin token:", error);
    throw new Error("Token generation failed");
  }
};

//verify user token

const verifyUserToken = (token) => {
  try {
    if (!config.JWT_SECRET.USER_SECRET) {
      throw new Error("JWT_USER_SECRET not configured");
    }
    return jwt.verify(token, config.JWT_SECRET.USER_SECRET);
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

//verify admin token

const verifyAdminToken = (token) => {
  try {
    if (!config.JWT_SECRET.ADMIN_SECRET) {
      throw new Error("JWT_ADMIN_SECRET not configured");
    }
    console.log("VERIFY SECRET:", config.JWT_SECRET.ADMIN_SECRET);
    return jwt.verify(token, config.JWT_SECRET.ADMIN_SECRET);
  } catch (error) {
    console.log("RAW JWT ERROR:", error.name, error.message);
    throw new Error("Token verification failed");
  }
};

module.exports = {
  generateUserToken,
  generateAdminToken,
  verifyUserToken,
  verifyAdminToken,
};
