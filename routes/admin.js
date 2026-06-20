const express = require("express");
const { dashboard } = require("../controller/AdminController");

const router = express.Router();

router.get("/dashboard", dashboard);


module.exports = router;
