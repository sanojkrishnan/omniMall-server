const express = require("express");

const router = express.Router();

router.get("/product", productFetch);

module.exports = router;
