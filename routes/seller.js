const express = require("express");
const { findProductSeller, fetchSingleSeller } = require("../controller");

const { userAuth } = require("../middleware/tockenVerify");

const router = express.Router();

router.post("/fetch", findProductSeller);
router.get("/fetch-single", userAuth, fetchSingleSeller);

module.exports = router;
