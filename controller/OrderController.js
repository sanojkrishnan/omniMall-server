const { OrderService } = require("../services");
const generateInvoice = require("../utils/generateInvoice");
const {
  validateId,
  placeOrderSchema,
  orderIdValidation,
} = require("../validation");
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

  static findSingleOrder = BaseController.asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const validatedUserId = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const validatedOrderId = BaseController.validateRequest(
      orderIdValidation,
      orderId,
    );
    const result = await OrderService.fetchSingleOrder(
      validatedUserId.id,
      validatedOrderId,
    );
    BaseController.logAction("ORDER_SINGLE_FETCH", result);

    BaseController.sendSuccess(res, "Order added successfully", result, 200);
  });
  static createInvoice = BaseController.asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    const validatedUserId = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const validatedOrderId = BaseController.validateRequest(
      orderIdValidation,
      orderId,
    );

    const order = await OrderService.createInvoice(
      validatedUserId.id,
      validatedOrderId,
    );

    const pdfBuffer = await generateInvoice(order);

    BaseController.logAction("ORDER_INVOICE_SEND", req.user, {
      orderId: order.orderId,
    });

    BaseController.sendSuccess(
      res,
      "Order invoice is downloading",
      {
        orderId: order.orderId,
        fileName: `invoice-${order.orderId}.pdf`,
        contentType: "application/pdf",
        invoice: pdfBuffer.toString("base64"),
      },
      200,
    );
  });
}

module.exports = OrderController;
