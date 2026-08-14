const CouponService = require("../services/couponService");
const {
  couponUpdateValidation,
  updateStatusValidation,
} = require("../validation/couponValidation");
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
    BaseController.logAction("COUPON_UPDATE", result);
    BaseController.sendSuccess(
      res,
      "Product updated successfully",
      result,
      200,
    );
  });

  // delete product
  static deleteCoupon = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await CouponService.deleteCoupon(validateData.id);
    BaseController.logAction("COUPON_DELETED", result);

    BaseController.sendSuccess(res, "Coupon deleted successfully", 200);
  });

  static updateCouponStatus = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log("STATUS ON COUPON :", status);

    const validateData = BaseController.validateRequest(
      updateStatusValidation,
      {
        id,
        status,
      },
    );
    const result = await CouponService.updateCouponStatus(validateData);
    BaseController.logAction("COUPON_STATUS_UPDATE", result);
    BaseController.sendSuccess(
      res,
      "Product updated successfully",
      result,
      200,
    );
  });
}

module.exports = CouponController;
