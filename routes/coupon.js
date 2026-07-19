const express = require("express");
const {
  couponFetch,
  singleCouponFetch,
} = require("../controller/CouponController");

const router = express.Router();

router.get("/fetch", couponFetch);
router.get("/singleFetch/:id", singleCouponFetch);

module.exports = router;
