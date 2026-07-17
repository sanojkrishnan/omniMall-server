const express = require("express");
const {
  fetchCart,
  addCart,
  removeCart,
  updateProductQuantity
} = require("../controller/CartController");
const { userAuth } = require("../middleware/tockenVerify");

const router = express.Router();

router.use(userAuth);

router.get("/fetch", fetchCart);
router.post("/add", addCart);
router.delete("/remove/:id", removeCart);
router.patch("/updateQuantity", updateProductQuantity);
module.exports = router;
