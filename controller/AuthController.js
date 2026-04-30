const AuthService = require("../services/authService");
const { registerValidation } = require("../utils/validation");
const BaseController = require("./BaseController");

class AuthController extends BaseController {
  //register controller
  static register = BaseController.asyncHandler(async (req, res) => {
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "user",
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
    };

    //profile image is optional
    if (req.file) {
      userData.profileImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }
    const validatedData = BaseController.validateRequest(
      registerValidation,
      userData,
    );
    const result = await AuthService.register(validatedData);
    BaseController.logAction("USER_REGISTER", result.user);
    BaseController.sendSuccess(
      res,
      "User registered successfully. Welcome!",
      result,
      201,
    );
  });
}

module.exports = AuthController;
