const express = require("express");
const { dashboard, findSeller } = require("../controller/AdminController");

const router = express.Router();

router.get("/dashboard", dashboard);

router.get("/seller", findSeller);

module.exports = router;
