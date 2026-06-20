const logger = require("../utils/logger");
const Product = require("../models/Product");
const User = require("../models/User");
const { AuthenticationError } = require("../utils/errors");

class AdminService {
  //fetch dashboard data
  static async dashboardFetch(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      logger.error("Add product error:", error);
      throw error;
    }
  }

 
}

module.exports = AdminService;
