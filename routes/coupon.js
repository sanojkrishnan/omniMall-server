const express = require("express");
const {
  couponFetch,
  singleCouponFetch,
  updateCoupon,
} = require("../controller/CouponController");

const router = express.Router();

router.get("/fetch", couponFetch);
router.get("/singleFetch/:id", singleCouponFetch);
router.patch("/update/:id", updateCoupon);

module.exports = router;
