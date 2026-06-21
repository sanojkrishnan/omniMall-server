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
  findSeller,
} = require("../controller/AuthController");
const { upload } = require("../config/cloudinary");
const {
  uploadProfileImage,
  deleteProfileImage,
} = require("../controller/imageController");

const router = express.Router();
//register route
router.post(
  "/register",
  upload.single("profileImage"),

  register,
);
//otp verification route
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
//login route
router.post("/login", login);
//image change
router.post(
  "/profile/image",
  upload.single("profileImage"),
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

module.exports = router;
