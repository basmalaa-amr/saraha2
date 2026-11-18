const express = require("express");
const controller = require("./message.controller");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const { createMessageSchema } = require("./message.validation");

const router = express.Router();

router.post("/to/:userId", validate(createMessageSchema), controller.create);
router.get("/mine", authenticate, controller.getMine);

module.exports = router;
