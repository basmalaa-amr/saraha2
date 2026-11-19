const authService = require("./auth.service");

const register = async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json({
        success: true,
        message: "Registration successful. Check your email for the verification code.",
        data: { id: user._id, userName: user.userName, email: user.email, isVerified: user.isVerified }
    });
};
const sendOtp = async (req, res) => {
    await authService.sendVerificationOtp(req.body);
    res.status(200).json({ success: true, message: "Verification code sent if the account can receive one." });
};
const verifyAccount = async (req, res) => {
    await authService.verifyAccount(req.body);
    res.status(200).json({ success: true, message: "Account verified successfully" });
};
const login = async (req, res) => {
    const data = await authService.login(req.body);
    res.status(200).json({ success: true, message: "Login successful", data });
};
const googleLogin = async (req, res) => {
    const data = await authService.loginWithGoogle(req.body);
    res.status(200).json({ success: true, message: "Google login successful", data });
};
const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body);
    res.status(200).json({ success: true, message: "If a local account exists for this email, a password reset code has been sent." });
};
const resetPassword = async (req, res) => {
    await authService.resetPassword(req.body);
    res.status(200).json({ success: true, message: "Password reset successfully" });
};

module.exports = { register, sendOtp, verifyAccount, login, googleLogin, forgotPassword, resetPassword };
