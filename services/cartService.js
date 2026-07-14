const Cart = require("../models/Cart");
const logger = require("../utils/logger");

class CartService {
  static async addCart(cartData) {
    try {
      const findCart = Cart.findById(cartData.sellerId);
      if (findCart) {
        //compete this tomorrow
      }
    } catch (error) {
      logger.error("Cart error:", error);
      throw error;
    }
  }

  //fetch cart
  static async fetchCart(userId) {
    try {
      const cart = await Cart.findById(userId);
    } catch (error) {
      logger.error("Cart error:", error);
      throw error;
    }
  }
}

module.exports = CartService;
