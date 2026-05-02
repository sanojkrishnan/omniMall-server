const express = require("express");
const {
  register,
  login,
  handleValidationError,
  sanitizeUser,
  verifyOTP,
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

module.exports = router;
