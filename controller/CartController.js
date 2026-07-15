const CartService = require("../services/cartService");
const { isCallForCart, addCartValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class CartController extends BaseController {
  static fetchCart = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(isCallForCart, {
      userId: req.query.userId,
    });

    const result = await CartService.fetchCart(validatedData.userId);

    BaseController.logAction("CART_FETCH", result);

    BaseController.sendSuccess(res, "Cart fetched successfully", result, 200);
  });

  static addCart = BaseController.asyncHandler(async (req, res) => {
    const { userId, cart } = req.body;
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
}

module.exports = CartController;
