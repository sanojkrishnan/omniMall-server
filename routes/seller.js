const express = require("express");
const {
  findProductSeller,
  fetchSingleSeller,
} = require("../controller/SellerController");
const router = express.Router();

router.post("/fetch", findProductSeller);
router.get("/fetch-single/:id", fetchSingleSeller);

module.exports = router;
