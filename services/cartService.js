const { error } = require("winston");
const Cart = require("../models/Cart");
const logger = require("../utils/logger");
const {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} = require("../utils/errors");

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

  static async removeCart({ userId, productId }) {
    try {
      if (!userId) {
        throw new AuthorizationError("User id is a must");
      }
      if (!productId) {
        throw new NotFoundError("The product id is missing");
      }

      await Cart.updateOne(
        { userId },
        {
          $pull: {
            cart: {
              productId: productId,
            },
          },
        },
      );
      const updatedCart = await Cart.findOne({ userId });
      console.log("WHAT IS INSIDE UPDATED CART:", updatedCart);
      return updatedCart;
    } catch (error) {
      logger.error("Cart error:", error);
      throw error;
    }
  }
}

module.exports = CartService;
