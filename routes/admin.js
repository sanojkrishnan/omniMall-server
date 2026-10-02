const express = require("express");
const { dashboard } = require("../controller/AdminController");
const { adminAuth } = require("../middleware/tockenVerify");
const { uploadCategoryImage } = require("../config/cloudinary");
const { deleteProduct } = require("../controller/AdminController");
const {
  updateCategory,
  deleteCategory,
  addCategory,
} = require("../controller/AdminController");
const {
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  addCoupon,
} = require("../controller/AdminController");


const router = express.Router();
router.use(adminAuth);

router.get("/dashboard", dashboard);

//category admin access
router.delete("/category/delete/:id", deleteCategory);
router.post("/category/add", uploadCategoryImage.single("categoryImage"), addCategory);
router.patch(
  "/category/update/:id",
  uploadCategoryImage.single("categoryImage"),
  updateCategory,
);

//coupon admin access
router.patch("/coupon/update/:id", updateCoupon);
router.delete("/coupon/delete/:id", deleteCoupon);
router.patch("/coupon/updateStatus/:id", updateCouponStatus);
router.post("/coupon/add", addCoupon);

//product admin access
router.delete("/product/delete/:id", deleteProduct); // product image deletion is in the image route

module.exports = router;
