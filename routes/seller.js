const express = require("express");
const {
  findProductSeller,
  fetchSingleSeller,
  updateSeller,
} = require("../controller");

const { userAuth, sellerAuth } = require("../middleware/tockenVerify");
const { uploadUserImage } = require("../config/cloudinary");

const router = express.Router();

router.post("/fetch", findProductSeller);
router.get("/fetch-single", userAuth, fetchSingleSeller);
router.patch(
  "/update-seller",
  sellerAuth,
  uploadUserImage.single("businessLogo"),
  updateSeller,
);

module.exports = router;
