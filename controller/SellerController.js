const AuthService = require("../services/authService");
const { isCallForSeller } = require("../utils/validation");
const BaseController = require("./BaseController");

class SellerController extends BaseController {
  //fetch all sellers
  static findProductSeller = BaseController.asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const seller = req.body ?? {};

    const validatedData =
      BaseController.validateRequest(isCallForSeller, seller) ?? {};

    const result = await AuthService.findSeller(
      Number(page) || 1,
      Number(limit) || 15,
      validatedData.uniqueSellers || [],
    );

    BaseController.logAction("SELLERS_FETCH", result.data);

    BaseController.sendSuccess(
      res,
      "Sellers fetched successfully",
      result,
      200,
    );
  });
  //fetch single seller
  static fetchSingleSeller = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("SELLER ID :", id);
    const result = await AuthService.fetchOneSeller(id);
    BaseController.logAction("SINGLE_SELLER_FETCH", result);

    BaseController.sendSuccess(
      res,
      "Seller fetched according to the id given",
      result,
      200,
    );
  });
}

module.exports = SellerController;
