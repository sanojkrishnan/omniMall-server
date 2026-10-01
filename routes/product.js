const express = require("express");
const {
  productFetch,
  addProduct,
  fetchSingleProduct,
  updateProduct,
} = require("../controller/ProductController");
const { uploadProductImage } = require("../config/cloudinary");
const { changeProductImage, deleteProductImage, saveProductImages } = require("../controller/ImageController");
const router = express.Router();

router.post("/fetch", productFetch);
router.post(
  "/register",
  uploadProductImage.array("productImage", 10),
  addProduct,
);

router.get("/fetch-single/:id", fetchSingleProduct);
router.patch("/update/:id", updateProduct);

router.post("/product/:id", uploadProductImage.array("productImage", 10), saveProductImages);
router.patch("/product/:id", uploadProductImage.single("productImage"), changeProductImage);

module.exports = router;
