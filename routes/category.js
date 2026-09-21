const express = require("express");
const {
  findProductCategory,
  fetchSingleCategory,
  updateCategory,
} = require("../controller/CategoryController");
const { uploadUserImage } = require("../config/cloudinary");
const router = express.Router();

router.post("/fetch", findProductCategory);
router.get("/fetch-single/:id", fetchSingleCategory);
router.patch(
  "/update/:id",
  uploadUserImage.single("categoryImage"),
  updateCategory,
);

module.exports = router;
