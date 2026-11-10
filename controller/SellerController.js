const { SellerService } = require("../services");
const BaseController = require("./BaseController");
const {
  validateId,
  isCallForSeller,
  sellerRegisterValidation,
} = require("../validation");
const { withCleanup } = require("../utils/cloudinaryCleanup");

class SellerController extends BaseController {
  static becomeSeller = BaseController.asyncHandler(async (req, res) => {
    const {
      storeName,
      productCategories,
      description,
      businessEmail,
      businessPhone,
      businessAddress,
      pickupLocation,
      conditionCheck,
    } = req.body;

    const sellerData = {
      storeName,
      productCategories,
      description,
      businessEmail,
      businessPhone,
      businessAddress,
      pickupLocation,
      conditionCheck,
    };
    const userId = req.user.id;

    // the logo is required, so a missing file fails validation
    if (req.file) {
      sellerData.businessLogo = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    // any failure removes the logo multer already uploaded
    const result = await withCleanup(req.file, async () => {
      const validatedData = BaseController.validateRequest(
        sellerRegisterValidation,
        sellerData,
      );
      const validatedUserId = BaseController.validateRequest(validateId, {
        id: userId,
      });
      return SellerService.register(validatedData, validatedUserId.id);
    });

    BaseController.logAction("SELLER_REGISTER", req.user);
    BaseController.sendSuccess(
      res,
      "The seller registration request has been submitted successfully. Please wait for approval.",
      result,
      201,
    );
  });
  //fetch all sellers
  static findProductSeller = BaseController.asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const seller = req.body ?? {};

    const validatedData =
      BaseController.validateRequest(isCallForSeller, seller) ?? {};

    const result = await SellerService.findSeller(
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
    const userId = req.user.id;

    const validatedData = BaseController.validateRequest(validateId, {
      id: userId,
    });
    const result = await SellerService.fetchOneSeller(validatedData.id);
    BaseController.logAction("SINGLE_SELLER_FETCH", result);

    BaseController.sendSuccess(
      res,
      `Welcome to ${result.seller.storeName}`,
      result,
      200,
    );
  });
}

module.exports = SellerController;
