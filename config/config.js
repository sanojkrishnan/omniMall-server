require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,

  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/project",

  CORS: {
    ORIGIN: process.env.CORS_STR || "http://localhost:3000",
    CREDENTIALS: true,
    METHODS: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    ALLOWED_HEADERS: ["Content-Type", "Authorization", "X-Requested-With"],
  },
  NODE_ENV: process.env.NODE_ENV || "development",

  RATE_LIMIT: {
    //to limit api calling
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    AUTH_MAX_REQUESTS: 5,
  },
  //admin seed
  ADMIN_PASS: process.env.ADMIN_PASSWORD || "admin123",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin123@omnimall.com",

  //jwt
  JWT_SECRET: {
    USER_SECRET: process.env.JWT_USER_SECRET,
    ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
    EXPIRE_IN: process.env.JWT_EXPIRES_IN,
  },

  //cloudinary
  CLOUDINARY_SECRET: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },

  //nodemailer
  EMAIL: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },

  //reset password
  FRONTEND_URL: process.env.FRONTEND_URL,

  //google authentication
  GOOGLE: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
};
