const AdminService = require("../services/adminService");
const { withCleanup } = require("../utils/cloudinaryCleanup");
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

// validates the admin id from the token with the shared id schema, returns the id string
const getAdminId = (req) =>
  BaseController.validateRequest(validateId, { id: req.admin.id }).id;

class AdminController extends BaseController {
  //dashboard data
  static dashboard = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);

    const result = await AdminService.dashboardFetch({ id: adminId });
    BaseController.logAction("DASHBOARD_FETCH", null, { adminId });

    BaseController.sendSuccess(
      res,
      "Dashboard fetched successfully",
      result,
      200,
    );
  });

  //coupon controller
  //add coupon
  static addCoupon = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);

    const validatedCoupon = BaseController.validateRequest(couponValidation, {
      ...req.body,
      createdBy: adminId,
    });

    const result = await AdminService.addCoupon(validatedCoupon);
    BaseController.logAction("COUPON_ADD", result);

    BaseController.sendSuccess(res, "Coupon added successfully", result, 201);
  });

  // update coupon (edit)
  static updateCoupon = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const { id } = req.params;
    const { data } = req.body;

    const validateData = BaseController.validateRequest(
      couponUpdateValidation,
      {
        id,
        data,
      },
    );

    const result = await AdminService.updateCoupon(validateData, adminId);
    BaseController.logAction("COUPON_UPDATE", result);

    BaseController.sendSuccess(res, "Coupon updated successfully", result, 200);
  });

  // delete coupon
  static deleteCoupon = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await AdminService.deleteCoupon(validateData.id, adminId);
    BaseController.logAction("COUPON_DELETED", result);

    BaseController.sendSuccess(res, "Coupon deleted successfully", result, 200);
  });

  // update coupon status
  static updateCouponStatus = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const { id } = req.params;
    const { status } = req.body;

    const validateData = BaseController.validateRequest(
      updateStatusValidation,
      {
        id,
        status,
      },
    );

    const result = await AdminService.updateCouponStatus(validateData, adminId);
    BaseController.logAction("COUPON_STATUS_UPDATE", result);

    BaseController.sendSuccess(
      res,
      "Coupon status updated successfully",
      result,
      200,
    );
  });

  //category controller
  // delete category
  static deleteCategory = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await AdminService.deleteCategory(validateData.id, adminId);
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
    const result = await withCleanup(req.file, async () => {
      // inside withCleanup so a failure here still removes the uploaded image
      const adminId = getAdminId(req);
      const { id } = req.params;

      // multipart sends `data` as a JSON string; also accept flat fields or a JSON body
      let data = req.body?.data ?? req.body ?? {};

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
      return AdminService.updateCategory(validated, adminId);
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
      const adminId = getAdminId(req);

      let data = req.body?.data ?? req.body ?? {};

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
      return AdminService.addCategory(validated, adminId);
    });

    BaseController.logAction("CATEGORY_ADD", result);
    BaseController.sendSuccess(res, "Category added successfully", result, 201);
  });

  //product controller
  // delete product
  static deleteProduct = BaseController.asyncHandler(async (req, res) => {
    const adminId = getAdminId(req);
    const { id } = req.params;

    const validateData = BaseController.validateRequest(validateId, { id });
    const result = await AdminService.deleteProduct(validateData.id, adminId);
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
