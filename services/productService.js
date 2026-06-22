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
  //fetch products with pagination from the database
  static async fetchProduct({ page = 1, limit = 15 } = {}) {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find({}).skip(skip).limit(limit),
        Product.countDocuments(),
      ]);

      return {
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error("Fetch product error:", error);
      throw error;
    }
  }
  static async deleteProduct(productId) {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      logger.info("Product deleted:", productId);
      return product;
    } catch (error) {
      logger.error("Delete product error:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
