const express = require("express");
const { findProductCategory } = require("../controller/CategoryController");
const router = express.Router();

router.post("/fetch", findProductCategory);

module.exports = router;
