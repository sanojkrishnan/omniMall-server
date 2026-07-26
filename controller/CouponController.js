const CouponService = require("../services/couponService");
const { paginationValidation } = require("../validation/paginationValidation");
const { validateId } = require("../validation/validationHelper");
const BaseController = require("./BaseController");

class CouponController extends BaseController {
  //coupon fetch
  static couponFetch = BaseController.asyncHandler(async (req, res) => {
    const { page, limit, search, sort } = req.query;

    const validatedData = BaseController.validateRequest(paginationValidation, {
      page,
      limit,
      search,
      sort,
    });

    const result = await CouponService.couponFetch({
      ...validatedData,
    });

    BaseController.sendSuccess(res, "Coupon fetch completed", result, 201);
  });

  //single coupon fetch
  static singleCouponFetch = BaseController.asyncHandler(async (req, res) => {
    const id = req.params.id;

    const validatedData = BaseController.validateRequest(validateId, { id });

    const result = await CouponService.singleCouponFetch(validatedData.id);
    BaseController.sendSuccess(res, "Coupon fetch completed", result, 200);
  });

  // update coupon (edit)
  static updateCoupon = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const validateData = BaseController.validateRequest(
      couponUpdateValidation,
      {
        id,
        data,
      },
    );
    const result = await CouponService.updateCoupon(validateData);
    BaseController.logAction("PRODUCT_UPDATE", result);
    BaseController.sendSuccess(res, "Product updated successfully", 200);
  });
}

module.exports = CouponController;
