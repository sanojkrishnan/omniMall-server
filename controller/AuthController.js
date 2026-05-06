const AuthService = require("../services/authService");
const {
  registerValidation,
  loginValidation,
  otpValidation,
  resetPasswordValidation,
} = require("../utils/validation");
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

  //otp verification controller
  static verifyOTP = BaseController.asyncHandler(async (req, res) => {
    const data = req.body;
    const validateData = BaseController.validateRequest(otpValidation, data);

    const result = await AuthService.verifyOTP(validateData); // call service

    BaseController.sendSuccess(res, "OTP verified successfully", result, 200);
  });

  //login controller
  static login = BaseController.asyncHandler(async (req, res) => {
    const loginData = req.body;
    const validateData = BaseController.validateRequest(
      loginValidation,
      loginData,
    );
    const result = await AuthService.login(validateData); // call service

    BaseController.sendSuccess(
      res,
      `welcome back! ${result.user.firstName}`,
      result,
      200,
    );
  });
  // forgot password controller
  static forgotPassword = BaseController.asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    BaseController.sendSuccess(res, result.message, null, 200);
  });
  // reset password controller
  static resetPassword = BaseController.asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    BaseController.validateRequest(resetPasswordValidation, {
      token,
      password,
    }); 
    const result = await AuthService.resetPassword(token, password);
    BaseController.sendSuccess(res, result.message, null, 200);
  });
}

module.exports = AuthController;
