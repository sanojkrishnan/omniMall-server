const { OAuth2Client } = require("google-auth-library");
const AuthService = require("../services/authService");
const {
  registerValidation,
  loginValidation,
  otpValidation,
  resetPasswordValidation,
  googleAuthValidation,
  googleProfileCompletionValidation,
} = require("../utils/validation");
const BaseController = require("./BaseController");
const config = require("../config/config");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      "Pl;ease verify your email with the OTP sent to your inbox",
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
    const result = await AuthService.login(validateData);

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

  //google sign in method

  static googleAuth = BaseController.asyncHandler(async (req, res) => {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("google payload", payload);
    const userData = {
      firstName: payload.given_name,
      lastName: payload.family_name || null,
      email: payload.email,
      profileImage: payload.picture
        ? {
            url: payload.picture,
            publicId: null,
          }
        : {
            url: null,
            publicId: null,
          },
    };

    const validatedData = BaseController.validateRequest(
      googleAuthValidation,
      userData,
    );

    const result = await AuthService.googleAuthentication(validatedData);
    BaseController.logAction("USER_REGISTER_USING_GOOGLE", result.user);

    if (result.user.status === "incomplete") {
      return BaseController.sendSuccess(
        res,
        "Please complete your registration by providing additional details",
        result,
        201,
      );
    }
    if (result.user.status === "active") {
      return BaseController.sendSuccess(
        res,
        `Welcome back, ${result.user.firstName}!`,
        result,
        200,
      );
    }
  });

  //google profile completion controller
  static googleProfileCompletion = BaseController.asyncHandler(
    async (req, res) => {
      const profileData = req.body;
      const validatedData = BaseController.validateRequest(
        googleProfileCompletionValidation,
        profileData,
      );
      const result = await AuthService.googleProfileCompletion(validatedData);
      BaseController.logAction("GOOGLE_PROFILE_COMPLETION", result);

      BaseController.sendSuccess(
        res,
        "All Done...! Your registration is complete.",
        result,
        201,
      );
    },
  );
}

module.exports = AuthController;
