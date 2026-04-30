const express = require("express");

const router = express.Router();
router.post("/register", upload.single("profileImage"), register);
router.post(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage,
);
router.delete("/profile/image", protect, deleteProfileImage);
