const { OAuth2Client } = require("google-auth-library");
const AuthService = require("../services/authService");
const BaseController = require("./BaseController");
const config = require("../config/config");
const {
  registerValidation,
  otpValidation,
  loginValidation,
  resetPasswordValidation,
  emailValidation,
  updateProfileValidation,
} = require("../validation/authValidation");
const {
  googleAuthValidation,
  googleProfileCompletionValidation,
} = require("../validation/googleValidation");
const { ValidationError } = require("../utils/errors");
const { withCleanup } = require("../utils/cloudinaryCleanup");
const { sellerRegisterValidation } = require("../validation/sellerValidation");
const { SellerService } = require("../services");
const { validateId } = require("../validation/validationHelper");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController extends BaseController {
  //register controller
  static register = BaseController.asyncHandler(async (req, res) => {
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: "user",
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
      "Please verify your email with the OTP sent to your inbox",
      result,
      201,
    );
  });

  //update profile controller (text fields and/or profile image)
  static updateProfile = BaseController.asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // pick only the editable fields; ignore anything else in the body
    const { firstName, lastName, dateOfBirth, gender } = req.body;
    const fields = Object.fromEntries(
      Object.entries({ firstName, lastName, dateOfBirth, gender }).filter(
        ([, value]) => value !== undefined,
      ),
    );

    // validation failures must also remove the file multer already uploaded
    const validatedData = await withCleanup(req.file, async () => {
      if (Object.keys(fields).length === 0 && !req.file) {
        throw new ValidationError("Provide at least one field to update");
      }
      return BaseController.validateRequest(updateProfileValidation, fields);
    });

    const result = await AuthService.updateProfile(
      userId,
      validatedData,
      req.file,
    );

    BaseController.logAction("USER_UPDATE_PROFILE", result);
    BaseController.sendSuccess(
      res,
      "Profile updated successfully",
      result,
      200,
    );
  });

  //resent OTP controller
  static resendOTP = BaseController.asyncHandler(async (req, res) => {
    const email = req.body;

    const validateData = BaseController.validateRequest(emailValidation, email);
    const result = await AuthService.resendOTP(validateData);

    BaseController.sendSuccess(res, "OTP resent successfully", result, 200);
  });

  //otp verification controller
  static verifyOTP = BaseController.asyncHandler(async (req, res) => {
    const data = req.body;
    const validateData = BaseController.validateRequest(otpValidation, data);

    const result = await AuthService.verifyOTP(validateData);

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

    const validateData = BaseController.validateRequest(emailValidation, {
      email,
    });

    const result = await AuthService.forgotPassword(validateData);
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

  static becomeSeller = BaseController.asyncHandler(async (req, res) => {
    const {
      storeName,
      productCategories,
      description,
      businessEmail,
      businessPhone,
      businessAddress,
      pickupLocation,
      conditionCheck,
    } = req.body;

    const sellerData = {
      storeName,
      productCategories,
      description,
      businessEmail,
      businessPhone,
      businessAddress,
      pickupLocation,
      conditionCheck,
    };
    const userId = req.user.id;

    // the logo is required, so a missing file fails validation
    if (req.file) {
      sellerData.businessLogo = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    // any failure removes the logo multer already uploaded
    const result = await withCleanup(req.file, async () => {
      const validatedData = BaseController.validateRequest(
        sellerRegisterValidation,
        sellerData,
      );
      const validatedUserId = BaseController.validateRequest(validateId, {
        id: userId,
      });
      return SellerService.register(validatedData, validatedUserId.id);
    });

    BaseController.logAction("SELLER_REGISTER", req.user);
    BaseController.sendSuccess(
      res,
      "The seller registration request has been submitted successfully. Please wait for approval.",
      result,
      201,
    );
  });
}

module.exports = AuthController;
