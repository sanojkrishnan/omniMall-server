const express = require("express");
const {
  register,
  login,
  handleValidationError,
  sanitizeUser,
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
  handleValidationError,
  sanitizeUser,
  register,
);
//login route
router.post("/login", handleValidationError, sanitizeUser, login);
//image change
router.post(
  "/profile/image",
  upload.single("profileImage"),
  uploadProfileImage,
);
//image edit
router.delete("/profile/image", deleteProfileImage);

module.exports = router;
