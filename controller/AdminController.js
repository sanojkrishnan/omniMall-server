const AuthService = require("../services/authService");
const { adminLoginValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
  //dashboard data
  static dashboard = BaseController.asyncHandler(async (req, res) => {
    dashboardData = req.body;

    const validatedData = BaseController.validateRequest(
      adminLoginValidation,
      dashboardData,
    );
    const result = await AuthService.register(validatedData);
    BaseController.logAction("USER_REGISTER", result.user);

    BaseController.sendSuccess(
      res,
      "Please verify your email with the OTP sent to your inbox",
      result,
      201,
    );
  });
}

module.exports = AdminController;
