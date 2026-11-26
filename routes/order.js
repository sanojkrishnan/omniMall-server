const express = require("express");
const { createOrder, findSingleOrder } = require("../controller");
const { userAuth } = require("../middleware/tockenVerify");

const router = express.Router();
router.use(userAuth);

router.post("/create-order", createOrder);
router.get("/fetch-single-order/:orderId", findSingleOrder);

module.exports = router;
