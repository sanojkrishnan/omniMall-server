const Address = require("../models/Address");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const {
  NotFoundError,
  ValidationError,
  ConflictError,
} = require("../utils/errors");
const logger = require("../utils/logger");

class OrderService {
  static async addOrder(orderData, userId) {
    try {
      const productId = orderData.items.map((item) => item.productId);
      const addressId = orderData.addressId;

      const existingProduct = await Address.find({ addressId });
      const existingAddress = await Product.find({ ...productId });

      if (!existingProduct || !existingAddress) {
        throw new NotFoundError("Invalid credential");
      }

      await Order.create({ orderData, userId: userId });

      logger.info("Order created:", created);
      return created;
    } catch (error) {
      logger.error("Ordering error:", error);
      throw error;
    }
  }
}

module.exports = OrderService;
