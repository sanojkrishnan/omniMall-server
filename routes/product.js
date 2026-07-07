const express = require("express");
const {
  productFetch,
  addProduct,
  deleteProduct,
  fetchSingleProduct,
} = require("../controller/ProductController");
const { uploadProductImage } = require("../config/cloudinary");
const router = express.Router();

router.post("/fetch", productFetch);
router.post(
  "/register",
  uploadProductImage.array("productImage", 10),
  addProduct,
);
router.delete("/delete/:id", deleteProduct);
router.get("/fetch-single/:id", fetchSingleProduct);

module.exports = router;
