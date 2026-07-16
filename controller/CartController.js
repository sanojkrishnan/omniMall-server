const CartService = require("../services/cartService");
const {
  isCallForCart,
  addCartValidation,
  removeCartValidation,
} = require("../utils/validation");
const BaseController = require("./BaseController");

class CartController extends BaseController {
  static fetchCart = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(isCallForCart, {
      userId: req.user.id,
    });

    const result = await CartService.fetchCart(validatedData.userId);

    BaseController.logAction("CART_FETCH", result);

    BaseController.sendSuccess(res, "Cart fetched successfully", result, 200);
  });

  static addCart = BaseController.asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const userId = req.user.id;
    const validatedData = BaseController.validateRequest(addCartValidation, {
      userId,
      cart,
    });

    const result = await CartService.addCart(validatedData);

    BaseController.logAction("CART_ADD", result);

    BaseController.sendSuccess(
      res,
      "Item added to cart successfully",
      result,
      200,
    );
  });

  static removeCart = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // From JWT/auth middleware

    const validatedData = BaseController.validateRequest(removeCartValidation, {
      userId,
      productId: id,
    });

    const result = await CartService.removeCart(validatedData);

    BaseController.logAction("CART_REMOVE", result);

    BaseController.sendSuccess(res, "Product removed from cart", result, 200);
  });
}

module.exports = CartController;
