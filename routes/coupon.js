const express = require("express");
const {
  couponFetch,
  singleCouponFetch,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  addCoupon,
} = require("../controller/CouponController");
const { adminAuth } = require("../middleware/tockenVerify");

const router = express.Router();

router.get("/fetch", couponFetch);
router.get("/singleFetch/:id", singleCouponFetch);
router.patch("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);
router.patch("/updateStatus/:id", updateCouponStatus);
router.post("/add", adminAuth, addCoupon );

module.exports = router;
