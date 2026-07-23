const AdminService = require("../services/adminService");
const { couponValidation, validateId } = require("../validation/paginationValidation");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
  //dashboard data
  static dashboard = BaseController.asyncHandler(async (req, res) => {
    const dashboardData = req.body;

    const validatedData = BaseController.validateRequest(
      validateId,
      dashboardData,
    );
    const result = await AdminService.dashboardFetch(validatedData);
    BaseController.logAction("USER_REGISTER", result.user);

    BaseController.sendSuccess(res, result, 201);
  });

  //coupon fetch for admin
  static coupon = BaseController.asyncHandler(async (req, res) => {
    const { page, limit, search, sort } = req.query;
    const adminId = req.admin.id;

    const validatedData = BaseController.validateRequest(
      couponValidation,
      page,
      limit,
      search,
      sort,
      adminId,
    );

    const result = await AdminService.couponFetch(validatedData);
    BaseController.sendSuccess(res, result, 201);
  });
}

module.exports = AdminController;
