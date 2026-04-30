const express = require("express");
const { register } = require("../controller/AuthController");
const { upload } = require("../config/cloudinary");
const {
  uploadProfileImage,
  deleteProfileImage,
} = require("../controller/imageController");

const router = express.Router();
router.post("/register", upload.single("profileImage"), register);
router.post(
  "/profile/image",
  upload.single("profileImage"),
  uploadProfileImage,
);
router.delete("/profile/image", deleteProfileImage);

module.exports = router;
