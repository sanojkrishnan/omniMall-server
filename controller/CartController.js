const CartService = require("../services/cartService");
const { isCallForCart, addCartValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class CartController extends BaseController {
  static fetchCart = BaseController.asyncHandler(async (req, res) => {
    const userId = req.body;
    const validatedData = BaseController.validateRequest(isCallForCart, userId);

    const result = await CartService.fetchCart(validatedData);

    BaseController.logAction("CATEGORY_FETCH", result.data);

    BaseController.sendSuccess(
      res,
      "Category fetched successfully",
      result,
      200,
    );
  });

  static addCart = BaseController.asyncHandler(async (req, res) => {
    const { userId, cart } = req.body;
    const validatedData = BaseController.validateRequest(addCartValidation, {
      userId,
      cart,
    });

    const result = await CartService.addCart(id);
    BaseController.logAction("SINGLE_CATEGORY_FETCH", result);

    BaseController.sendSuccess(
      res,
      "Category fetched according to the id given",
      result,
      200,
    );
  });
}

module.exports = CartController;
