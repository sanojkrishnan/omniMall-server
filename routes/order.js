const express = require("express");
const { createOrder } = require("../controller");
const { userAuth } = require("../middleware/tockenVerify");

const router = express.Router();
router.use(userAuth);

router.post("/create-order", createOrder);

module.exports = router;
