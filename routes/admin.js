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
router.delete("/delete/:id", deleteCategory);
router.post("/add", uploadCategoryImage.single("categoryImage"), addCategory);
router.patch(
  "/update/:id",
  uploadCategoryImage.single("categoryImage"),
  updateCategory,
);

//coupon admin access
router.patch("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);
router.patch("/updateStatus/:id", updateCouponStatus);
router.post("/add", addCoupon);

//product admin access
router.delete("/delete/:id", deleteProduct); // product image deletion is in the image route

module.exports = router;
