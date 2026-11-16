const { SellerService } = require("../services");
const BaseController = require("./BaseController");
const {
  validateId,
  isCallForSeller,
  sellerRegisterValidation,
  sellerUpdateValidation,
} = require("../validation");
const { withCleanup } = require("../utils/cloudinaryCleanup");

class SellerController extends BaseController {
  // register
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

    // the logo is not part of the Joi schema, so check it here
    if (!req.file) {
      return BaseController.sendError(res, "Business logo is required", 400);
    }

    // any failure removes the logo multer already uploaded
    const result = await withCleanup(req.file, async () => {
      const validatedData = BaseController.validateRequest(
        sellerRegisterValidation,
        sellerData,
      );
      const validatedUserId = BaseController.validateRequest(validateId, {
        id: req.user.id,
      });
      return SellerService.register(
        validatedData,
        validatedUserId.id,
        toLogo(req.file),
      );
    });

    BaseController.logAction("SELLER_REGISTER", req.user);
    BaseController.sendSuccess(
      res,
      "The seller registration request has been submitted successfully. Please wait for approval.",
      result,
      201,
    );
  });

  // fetch all sellers
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

  // fetch single seller
  static fetchSingleSeller = BaseController.asyncHandler(async (req, res) => {
    const validatedId = BaseController.validateRequest(validateId, {
      id: req.user.id,
    });
    const result = await SellerService.fetchOneSeller(validatedId.id);

    BaseController.logAction("SINGLE_SELLER_FETCH", result);
    BaseController.sendSuccess(
      res,
      `Welcome to ${result.seller.storeName}`,
      result,
      200,
    );
  });

  // update seller

  static updateSeller = BaseController.asyncHandler(async (req, res) => {
    const allowed = [
      "storeName",
      "businessEmail",
      "description",
      "businessPhone",
      "businessAddress",
      "pickupLocation",
      "productCategories",
    ];

    // Pick only editable fields
    const sellerData = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        sellerData[key] = req.body[key];
      }
    }

    // Same file-cleanup pattern as updateProfile
    const result = await withCleanup(req.file, async () => {
      const validatedSellerId = BaseController.validateRequest(validateId, {
        id: req.seller.id,
      });

      const validatedData = BaseController.validateRequest(
        sellerUpdateValidation,
        sellerData,
      );

      if (Object.keys(validatedData).length === 0 && !req.file) {
        throw new ValidationError("Provide at least one field to update");
      }

      // Pass the original Multer file, just like updateProfile
      return SellerService.updateSeller(
        validatedSellerId.id,
        validatedData,
        req.file,
      );
    });

    BaseController.logAction("SELLER_UPDATE", result);

    BaseController.sendSuccess(res, "Seller updated successfully", result, 200);
  });
}

module.exports = SellerController;
