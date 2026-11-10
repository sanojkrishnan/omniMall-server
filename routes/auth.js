const express = require("express");
const {
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleProfileCompletion,
  resendOTP,
  updateProfile,
  becomeSeller,
  uploadProfileImage,
  deleteProfileImage,
} = require("../controller");
const { uploadUserImage } = require("../config/cloudinary");

const { userAuth } = require("../middleware/tockenVerify");

const router = express.Router();
//register route
router.post(
  "/register",
  uploadUserImage.single("profileImage"),

  register,
);
//edit profile route
router.patch(
  "/update-profile",
  userAuth,
  uploadUserImage.single("profileImage"),
  updateProfile,
);
//otp verification route
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
//login route
router.post("/login", login);
//image change
router.post(
  "/profile/image",
  uploadUserImage.single("profileImage"),
  uploadProfileImage,
);
//image edit
router.delete("/profile/image", deleteProfileImage);

// forgot password route
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

//google login method
router.post("/google", googleAuth);
router.patch("/complete-profile", googleProfileCompletion);

//seller registration route
router.post(
  "/become-seller",
  userAuth,
  uploadUserImage.single("businessLogo"),
  becomeSeller,
);

module.exports = router;
