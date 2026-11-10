const express = require("express");
const { couponFetch, singleCouponFetch } = require("../controller");
const { adminAuth } = require("../middleware/tockenVerify");

const router = express.Router();

router.get("/fetch", couponFetch);
router.get("/singleFetch/:id", singleCouponFetch);

module.exports = router;
