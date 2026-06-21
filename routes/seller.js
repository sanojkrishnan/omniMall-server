const express = require("express");
const { findProductSeller } = require("../controller/SellerController");
const router = express.Router();

router.post("/fetch", findProductSeller);

module.exports = router;
