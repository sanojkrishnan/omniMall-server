const AdminService = require("../services/adminService");
const { dashboardValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
  //dashboard data
  static dashboard = BaseController.asyncHandler(async (req, res) => {
    dashboardData = req.body;

    const validatedData = BaseController.validateRequest(
      dashboardValidation,
      dashboardData,
    );
    const result = await AdminService.dashboardFetch(validatedData);
    BaseController.logAction("USER_REGISTER", result.user);

    BaseController.sendSuccess(res, result, 201);
  });
}

module.exports = AdminController;
