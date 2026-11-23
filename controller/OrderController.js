const { OrderService } = require("../services");
const { validateId, placeOrderSchema } = require("../validation");
const BaseController = require("./BaseController");

class OrderController extends BaseController {
  static createOrder = BaseController.asyncHandler(async (req, res) => {
    const order = req.body;
    console.log("VALUES FROM THE CONTROLLER:", req.body);
    const userId = req.user.id;
    const validatedData = BaseController.validateRequest(
      placeOrderSchema,
      order,
    );
    const validatedId = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const result = await OrderService.addOrder(validatedData, validatedId.id);
    BaseController.logAction("ORDER_ADD", result);

    BaseController.sendSuccess(res, "Order added successfully", result, 200);
  });
}

module.exports = OrderController;
