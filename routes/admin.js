const express = require("express");
const { dashboard } = require("../controller/AdminController");
const { adminAuth } = require("../middleware/tockenVerify");

const router = express.Router();
router.use(adminAuth);

router.get("/dashboard", dashboard);

module.exports = router;
