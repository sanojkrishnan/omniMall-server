const AuthService = require("../services/authService");
const { registerValidation, loginValidation } = require("../utils/validation");
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

  //login controller
  static login = BaseController.asyncHandler(async (req, res) => {
    const loginData = req.body;
    const validateData = BaseController.validateRequest(
      loginValidation,
      loginData,
    );
  });
}

module.exports = AuthController;
