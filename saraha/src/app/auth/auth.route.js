const express = require("express");
const rateLimit = require("express-rate-limit");
const controller = require("./auth.controller");
const validate = require("../middleware/validate");
const schemas = require("./auth.validation");

const router = express.Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, message: "Too many authentication requests. Please try again later." }
});

router.post("/register", authLimiter, validate(schemas.registerSchema), controller.register);
router.post("/send-otp", authLimiter, validate(schemas.emailSchema), controller.sendOtp);
router.post("/verify-account", authLimiter, validate(schemas.verifySchema), controller.verifyAccount);
router.post("/login", authLimiter, validate(schemas.loginSchema), controller.login);
router.post("/google", authLimiter, validate(schemas.googleSchema), controller.googleLogin);
router.post("/forget-password", authLimiter, validate(schemas.emailSchema), controller.forgotPassword);
router.post("/reset-password", authLimiter, validate(schemas.resetPasswordSchema), controller.resetPassword);

module.exports = router;
