const Cart = require("../models/Cart");
const logger = require("../utils/logger");

class CartService {
  static async addCart(cartData) {
    try {
      const { userId, cart: items } = cartData;

      let userCart = await Cart.findOne({ userId });

      if (!userCart) {
        userCart = new Cart({ userId, cart: items });
      } else {
        items.forEach((newItem) => {
          const existingItem = userCart.cart.find(
            (item) =>
              item.productId.toString() === newItem.productId &&
              item.sellerId.toString() === newItem.sellerId,
          );

          if (existingItem) {
            existingItem.qnty += newItem.qnty;
          } else {
            userCart.cart.push(newItem);
          }
        });
      }

      await userCart.save();
      return userCart;
    } catch (error) {
      logger.error("Cart error:", error);
      throw error;
    }
  }

  static async fetchCart(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      return cart;
    } catch (error) {
      logger.error("Cart error:", error);
      throw error;
    }
  }
}

module.exports = CartService;