const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateUserToken } = require("../utils/jwt");
const logger = require("../utils/logger");
const crypto = require("crypto");
const {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} = require("../utils/errors");
const { sendOTPEmail, sendResetEmail } = require("../utils/nodemailer");
const generateOTP = require("../utils/generateOtp");

class AuthService {
  //registration
  static async register(userData) {
    try {
      const existingUser = await User.findOne({
        email: userData.email,
        isVerified: true,
        otp: { $exists: false },
      });

      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }

      await User.deleteOne({
        email: userData.email,
        isVerified: false,
      });

      const otp = generateOTP();

      const tempUser = await User.create({
        ...userData,
        otp,
        otpValidationExpires: new Date(Date.now() + 5 * 60 * 1000),
      });

      try {
        await sendOTPEmail(userData.email, otp);
      } catch (emailError) {
        // rollback database record
        await User.findByIdAndDelete(tempUser._id);

        throw new Error("Failed to send OTP email");
      }

      return {
        message:
          "OTP sent to your email. Please verify to complete registration.",
      };
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  }

  static async verifyOTP({ email, otp }) {
    try {
      // 1. find otp record
      const record = await User.findOne({ email });
      if (!record) {
        throw new AuthenticationError(
          "OTP not found. Please request a new one.",
        );
      }

      // 2. check if expired
      if (new Date() > record.otpValidationExpires) {
        await User.deleteOne({ email });
        throw new AuthenticationError(
          "OTP has expired. Please request a new one.",
        );
      }

      // 3. check if otp matches
      const isMatch = await bcrypt.compare(otp, record.otp);
      if (!isMatch) {
        throw new AuthenticationError("Invalid OTP. Please try again.");
      }

      // 4. delete OTP — it's used now
      await User.deleteOne({ email });

      // 5. create the user using stored userData
      const {
        otp: _,
        otpValidationExpires,
        _id,
        __v,
        ...userData
      } = record.toObject();
      const user = new User({ ...userData, isVerified: true });
      user.$locals.skipPasswordHash = true;
      await user.save();
      // 6. generate token
      const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      logger.info(`User verified and registered: ${email}`);

      return {
        user: user.getPublicProfile(),
        token,
      };
    } catch (error) {
      logger.error("OTP verification error:", error);
      throw error;
    }
  }

  //resend OTP
  static async resendOTP({ email }) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new NotFoundError("User not found");
      }
      if (
        user.otpLastSentAt &&
        Date.now() - user.otpLastSentAt.getTime() < 30 * 1000
      ) {
        throw new BadRequestError(
          "Please wait 30 seconds before requesting another OTP",
        );
      }
      const otp = generateOTP();
      user.otp = otp;
      user.otpValidationExpires = new Date(Date.now() + 5 * 60 * 1000);
      user.otpLastSentAt = new Date();
      await user.save();
      try {
        await sendOTPEmail(email, otp);
      } catch (emailError) {
        logger.error("Failed to send OTP email", emailError);
        throw new Error("Failed to send OTP email");
      }
      return {
        message: "OTP resent successfully",
      };
    } catch (error) {
      logger.error("OTP resend error", error);
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const { email, password } = credentials;

      const user = await User.findByEmail(email);
      if (!user || user.provider === "google") {
        throw new AuthenticationError("Invalid email or password");
      }

      if (user.status === "banned") {
        throw new AuthenticationError(
          "Your account has been banned. Please contact administrator.",
        );
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid email or password");
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      logger.info(`User logged in: ${email}`);

      return {
        user: user.getPublicProfile(),
        token,
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      delete updateData.password;
      delete updateData.role;
      delete updateData.status;

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      logger.info(`Profile updated: ${user.email}`);

      return user.getPublicProfile();
    } catch (error) {
      logger.error("Profile update error:", error);
      throw error;
    }
  }

  static async changePassword(userId, passwordData) {
    try {
      const { currentPassword, newPassword } = passwordData;

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const isCurrentPasswordValid =
        await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError("Current password is incorrect");
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      return true;
    } catch (error) {
      logger.error("Password change error:", error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user.getPublicProfile();
    } catch (error) {
      logger.error("Get user error:", error);
      throw error;
    }
  }

  static async validateUser(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      if (user.status === "banned") {
        throw new AuthenticationError("Account has been banned");
      }

      return user;
    } catch (error) {
      logger.error("User validation error:", error);
      throw error;
    }
  }
  //forgot password - generate token, save to user, send email with reset link
  // AuthService.js - replace forgotPassword
  static async forgotPassword(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) throw new NotFoundError("User not found");

      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await sendResetEmail(user.email, resetURL);

      return { message: "Password reset link sent to your email" };
    } catch (error) {
      logger.error("Forgot password error:", error);
      throw error;
    }
  }

  //google auth services
  static async googleAuthentication(userData) {
    console.log("user data in auth service", userData);
    try {
      let user = await User.findOne({
        email: userData.email,
      });

      if (user && user.provider !== "google") {
        throw new ConflictError(
          "Email already registered with a different provider",
        );
      }
      if (!user) {
        console.log("Creating user:", {
          ...userData,
          isVerified: true,
        });
        user = await User.create({
          ...userData,
          isVerified: true,
        });
      }
      if (user.provider === "google") {
        user.lastLogin = new Date();
        await user.save();
      }

      const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      return {
        user: user.getPublicProfile(),
        token,
      };
    } catch (error) {
      logger.error("Google auth error:", error);
      throw error;
    }
  }
  // profile completing if the user is sign up with google account
  static async googleProfileCompletion(profileData) {
    try {
      console.log("Profile Data:", profileData);

      const user = await User.findByIdAndUpdate(
        profileData.profileId,
        {
          dateOfBirth: profileData.dateOfBirth,
          gender: profileData.gender,
          status: "active",
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!user) {
        throw new NotFoundError("User not found");
      }

      console.log("Updated User:", user);

      return user.getPublicProfile();
    } catch (error) {
      logger.error("Something went wrong please try again:", error);
      throw error;
    }
  }

  // AuthService.js - replace resetPassword
  static async resetPassword(token, newPassword) {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      //  find by token only first
      const user = await User.findOne({ resetPasswordToken: hashedToken });
      if (!user) throw new AuthenticationError("Invalid reset token");

      console.log("Expires at:", user.resetPasswordExpires);
      console.log("Now:", new Date());
      console.log("Is expired:", user.resetPasswordExpires < Date.now());

      //  check expiry separately
      if (user.resetPasswordExpires < Date.now()) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        throw new AuthenticationError(
          "Reset link has expired. Please request a new one.",
        );
      }

      //  valid — reset password
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return { message: "Password reset successful" };
    } catch (error) {
      logger.error("Reset password error:", error);
      throw error;
    }
  }

  //fetch all seller users
  static async findSeller(page = 1, limit = 15, uniqueSellers = []) {
    try {
      const skip = (page - 1) * limit;

      const filter = { _id: { $in: uniqueSellers }, role: "seller" };

      const [seller, total] = await Promise.all([
        User.find(filter).skip(skip).limit(limit),
        User.countDocuments(filter),
      ]);

      return {
        data: seller,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error("Seller fetching error:", error);
      throw error;
    }
  }
}

module.exports = AuthService;
