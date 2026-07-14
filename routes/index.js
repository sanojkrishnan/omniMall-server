const config = require("../config/config");
const { createAuthLimiter } = require("../middleware/setup"); //limits the authentication calls

const authRoutes = require("./auth"); //path for authentication
const adminRoutes = require("./admin"); //path for admin
const userRoutes = require("./user"); //path for users
const sellerRoutes = require("./seller"); //path for sellers
const productRoutes = require("./product"); //path for products
const categoryRoutes = require("./category"); //path for categories
const cartRoutes = require("./cart"); //path for cart

const setupRoutes = (app) => {
  //main protected routes
  const authLimiter = createAuthLimiter();
  const shouldUseAuthLimiter = config.NODE_ENV === "production";

  app.use(
    "/api/auth",
    ...(shouldUseAuthLimiter ? [authLimiter] : []),
    authRoutes,
  );
  app.use(
    "/api/admin",
    ...(shouldUseAuthLimiter ? [authLimiter] : []),
    adminRoutes,
  );
  app.use(
    "/api/product",
    ...(shouldUseAuthLimiter ? [authLimiter] : []),
    productRoutes,
  );
  app.use(
    "/api/seller",
    ...(shouldUseAuthLimiter ? [authLimiter] : []),
    sellerRoutes,
  );
  app.use(
    "/api/category",
    ...(shouldUseAuthLimiter ? [authLimiter] : []),
    categoryRoutes,
  );
  app.use(
    "/api/cart",
    ...(shouldUseAuthLimiter ? [authLimiter] : []),
    cartRoutes,
  );
};

module.exports = {
  setupRoutes,
};
