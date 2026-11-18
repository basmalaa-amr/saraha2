const express = require("express");
const authenticate = require("../middleware/authenticate");
const userController = require("./user.controller");

const router = express.Router();
router.get("/me", authenticate, userController.getProfile);

module.exports = router;
