const express = require("express");
const {
  productFetch,
  addProduct,
  deleteProduct,
} = require("../controller/ProductController");
const router = express.Router();

router.get("/fetch", productFetch);
router.post("/register", addProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
