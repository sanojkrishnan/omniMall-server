const express = require("express");
const {
  productFetch,
  addProduct,
  deleteProduct,
  fetchSingleProduct,
} = require("../controller/ProductController");
const { upload } = require("../config/cloudinary");
const router = express.Router();

router.get("/fetch", productFetch);
router.post("/register", upload.array("productImage", 10), addProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/fetch-single/:id", fetchSingleProduct);

module.exports = router;
