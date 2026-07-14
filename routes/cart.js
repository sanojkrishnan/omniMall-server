const express = require("express");
const { fetchCart, addCart } = require("../controller/CartController");
const router = express.Router();

router.get("/fetch", fetchCart);
router.get("/fetch", addCart);

module.exports = router;
