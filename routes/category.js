const express = require("express");
const {
  findProductCategory,
  fetchSingleCategory,
} = require("../controller/CategoryController");
const router = express.Router();

router.post("/fetch", findProductCategory);
router.get("/fetch-single/:id", fetchSingleCategory);

module.exports = router;
