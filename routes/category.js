const express = require("express");
const {
  findProductCategory,
  fetchSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/CategoryController");
const { uploadCategoryImage } = require("../config/cloudinary");
const router = express.Router();

router.post("/fetch", findProductCategory);
router.get("/fetch-single/:id", fetchSingleCategory);
router.patch(
  "/update/:id",
  uploadCategoryImage.single("categoryImage"),
  updateCategory,
);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
