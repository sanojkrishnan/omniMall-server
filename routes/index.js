const config = require("../config/config");
const { createAuthLimiter } = require("../middleware/setup"); //limits the authentication calls

const authRoutes = require("./auth"); //path for authentication
const adminRoutes = require("./admin"); //path for admin
const userRoutes = require("./user"); //path for users
const sellerRoutes = require("./seller"); //path for sellers

const setupRoutes = (app) => {
  //main protected routes
  const authLimiter = createAuthLimiter();
  const shouldUseAuthLimiter = config.NODE_ENV === "production";

  app.use("/api/auth", shouldUseAuthLimiter ? authLimiter : [], authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/seller", sellerRoutes);
};

module.exports = {
  setupRoutes,
};
