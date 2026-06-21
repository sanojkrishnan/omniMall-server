const AuthService = require("../services/authService");
const { isCallForSeller } = require("../utils/validation");
const BaseController = require("./BaseController");

class SellerController extends BaseController {
  //fetch all sellers
  static findProductSeller = BaseController.asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const sellers = req.body;

    const validatedData = BaseController.validateRequest(
      isCallForSeller,
      sellers,
    );

    const result = await AuthService.findSeller(
      Number(page) || 1,
      Number(limit) || 15,
      validatedData.uniqueSellers,
    );

    BaseController.logAction("SELLER_FETCH_", result.data);

    BaseController.sendSuccess(
      res,
      "Sellers fetched successfully",
      result,
      200,
    );
  });
}

module.exports = SellerController;
