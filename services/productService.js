const logger = require("../utils/logger");
const Product = require("../models/Product");

class ProductService {
  static async addProduct(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      logger.error("Add product error:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
