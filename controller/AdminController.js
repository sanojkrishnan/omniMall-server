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
 //fetch users for admin
  static findSeller = BaseController.asyncHandler(async (req, res) => {
    isAdminCall = req.query;
    const validatedData = BaseController.validateRequest(
      isAdminCallForSeller,
      isAdminCall,
    );
    const result = await AdminService.findSeller(validatedData);

    BaseController.logAction("SELLER_FETCH_FROM_ADMIN", result.user);

    BaseController.sendSuccess(res, result, 201);
  });
}

module.exports = AdminController;
