const CouponService = require("../services/CouponService");
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
    const Id = req.params.id;

    const validatedData = BaseController.validateRequest(validateId, couponId);

    const result = await CouponService.singleCouponFetch(
      validatedData.couponId,
    );
    BaseController.sendSuccess(res, "Coupon fetch completed", result, 200);
  });
}

module.exports = CouponController;
