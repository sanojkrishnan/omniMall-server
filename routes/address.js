const express = require("express");
const { userAuth } = require("../middleware/tockenVerify");
const {
  fetchAddress,
  addAddress,
  makeDefaultAddress,
  deleteAddress,
  updateAddress,
} = require("../controller");

const router = express.Router();

router.use(userAuth);

router.get("/fetch-address", fetchAddress);

router.post("/add-address", addAddress);

router.patch("/set-default", makeDefaultAddress);

router.delete("/delete-address/:addressId", deleteAddress);

router.patch("/update-address/:addressId", updateAddress);

module.exports = router;
