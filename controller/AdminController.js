const AdminService = require("../services/adminService");
const { ValidationError } = require("../utils/errors");
const {
  categoryValidation,
  categoryUpdateValidation,
} = require("../validation/categoryValidation");
const {
  couponValidation,
  couponUpdateValidation,
  updateStatusValidation,
} = require("../validation/couponValidation");
const { validateId } = require("../validation/validationHelper");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
  //dashboard data
  static dashboard = BaseController.asyncHandler(async (req, res) => {
    const id = req.admin.id;

    const validatedData = BaseController.validateRequest(validateId, { id });
    const result = await AdminService.dashboardFetch(validatedData);
    BaseController.logAction("USER_REGISTER", result.user);

    BaseController.sendSuccess(res, result, 201);
  });
  //coupon controller
  //add coupon
  static addCoupon = BaseController.asyncHandler(async (req, res) => {
    const coupon = { ...req.body, createdBy: req.admin.id };

    const validatedCoupon = BaseController.validateRequest(
      couponValidation,
      coupon,
    );

    const result = await CouponService.addCoupon(validatedCoupon);

    BaseController.sendSuccess(res, "Coupon added successfully", result, 201);
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

  // delete coupon
  static deleteCoupon = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await CouponService.deleteCoupon(validateData.id);
    BaseController.logAction("COUPON_DELETED", result);

    BaseController.sendSuccess(res, "Coupon deleted successfully", result, 200);
  });

  //update coupon
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

  //category controller
  // delete category
  static deleteCategory = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await CategoryService.deleteCategory(validateData.id);
    BaseController.logAction("CATEGORY_DELETED", result);

    BaseController.sendSuccess(
      res,
      "Category deleted successfully",
      result,
      200,
    );
  });

  //edit category
  static updateCategory = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await withCleanup(req.file, async () => {
      // multipart sends `data` as a JSON string; also accept flat fields or a JSON body
      let data = req.body?.data ?? req.body ?? {};
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          throw new ValidationError("`data` must be valid JSON");
        }
      }
      data = { ...data };

      // the image only ever comes from the uploaded file, never from the client body
      delete data.categoryImage;
      if (req.file) {
        data.categoryImage = {
          url: req.file.path,
          publicId: req.file.filename,
        };
      }

      const validated = BaseController.validateRequest(
        categoryUpdateValidation,
        {
          id,
          data,
        },
      );
      return CategoryService.updateCategory(validated);
    });

    BaseController.logAction("CATEGORY_UPDATE", result);
    BaseController.sendSuccess(
      res,
      "Category updated successfully",
      result,
      200,
    );
  });

  //add category
  static addCategory = BaseController.asyncHandler(async (req, res) => {
    const result = await withCleanup(req.file, async () => {
      let data = req.body?.data ?? req.body ?? {};

      console.log("CONSOLES THE ENTIRE REQUEST : ", req.body);

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          throw new ValidationError("`data` must be valid JSON");
        }
      }
      data = { ...data };

      // the image only ever comes from the uploaded file
      delete data.categoryImage;
      if (req.file) {
        data.categoryImage = {
          url: req.file.path,
          publicId: req.file.filename,
        };
      }

      const validated = BaseController.validateRequest(
        categoryValidation,
        data,
      );
      return CategoryService.addCategory(validated);
    });

    BaseController.logAction("CATEGORY_ADD", result);
    BaseController.sendSuccess(res, "Category added successfully", result, 201);
  });

  //product controller
  // delete product
  static deleteProduct = BaseController.asyncHandler(async (req, res) => {
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await ProductService.deleteProduct(validateData.id);
    BaseController.logAction("PRODUCT_DELETED", result);

    BaseController.sendSuccess(
      res,
      "Product deleted successfully",
      result,
      200,
    );
  });
}

module.exports = AdminController;
