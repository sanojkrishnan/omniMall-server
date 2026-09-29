const express = require("express");
const {
  findProductCategory,
  fetchSingleCategory,
  updateCategory,
} = require("../controller/CategoryController");
const { saveCategoryImage } = require("../controller/ImageController");
const { uploadCategoryImage } = require("../config/cloudinary");
const router = express.Router();

router.post("/fetch", findProductCategory);
router.get("/fetch-single/:id", fetchSingleCategory);
router.patch(
  "/update/:id",
  uploadCategoryImage.single("categoryImage"),
  saveCategoryImage,
  updateCategory,
);

module.exports = router;
