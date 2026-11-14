const express = require("express");
const { userAuth } = require("../middleware/tockenVerify");
const {
  fetchAddress,
  addAddress,
  makeDefaultAddress,
} = require("../controller");

const router = express.Router();

router.use(userAuth);

router.get("/fetch-address", fetchAddress);

router.post("/add-address", addAddress);

router.patch("/set-default", makeDefaultAddress);

module.exports = router;
