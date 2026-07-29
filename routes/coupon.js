const express = require("express");
const {
  couponFetch,
  singleCouponFetch,
  updateCoupon,
  deleteCoupon,
} = require("../controller/CouponController");

const router = express.Router();

router.get("/fetch", couponFetch);
router.get("/singleFetch/:id", singleCouponFetch);
router.patch("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);

module.exports = router;
