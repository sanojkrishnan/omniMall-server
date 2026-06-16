const logger = require("../utils/logger");
const Product = require("../models/Product");

class AdminService {
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
