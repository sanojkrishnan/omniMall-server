// routes/userRoutes.js
const { upload } = require("../config/cloudinary");
const { uploadProfileImage, deleteProfileImage } = require("../controllers/ImageController");
const { protect } = require("../middleware/auth"); // your existing auth middleware

router.post(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

router.delete("/profile/image", protect, deleteProfileImage);