// routes/userRoutes.js
const { upload } = require("../config/cloudinary");
const {
  uploadProfileImage,
  deleteProfileImage,
} = require("../controllers/ImageController");
const { protect } = require("../middleware/auth"); // existing auth middleware
const { adminAuth } = require("../middleware/tockenVerify");

//user
router.post(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage,
);
router.delete("/profile/image", protect, deleteProfileImage);

//product image
router.delete("/product/:id", adminAuth, deleteProductImage);
