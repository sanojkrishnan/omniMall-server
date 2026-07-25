const CartService = require("../services/cartService");
const BaseController = require("./BaseController");
const {
  addCartValidation,
  removeCartValidation,
  updateCartQuantityValidation,
} = require("../validation/cartValidation");
const { validateId } = require("../validation/validationHelper");

class CartController extends BaseController {
  static fetchCart = BaseController.asyncHandler(async (req, res) => {
    const id = req.user.id;
    const validatedData = BaseController.validateRequest(validateId, {
      id,
    });

    const result = await CartService.fetchCart(validatedData.id);

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

  static updateProductQuantity = BaseController.asyncHandler(
    async (req, res) => {
      const data = req.body;
      const userId = req.user.id;
      const validatedData = BaseController.validateRequest(
        updateCartQuantityValidation,
        {
          userId,
          ...data,
        },
      );
      console.log("UPDATE QUANTITY :", data);
      const result = await CartService.updateCartQuantity(validatedData);
      BaseController.logAction("CART_REMOVE", result);
      BaseController.sendSuccess(res, "Quantity updated", result, 200);
    },
  );
}

module.exports = CartController;
