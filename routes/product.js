const express = require("express");
const { productFetch, addProduct } = require("../controller/ProductController");
const router = express.Router();

router.get("/fetch", productFetch);
router.post("/register", addProduct);

module.exports = router;
