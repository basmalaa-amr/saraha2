const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const userRepository = require("../user/user.repository");
const otpService = require("../otp/otp.service");
const AppError = require("../common/errors/appError");
const { signToken } = require("../utils/token");
const { publicUser } = require("../utils/response");

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const googleClient = new OAuth2Client();

const authResult = (user) => ({ token: signToken(user), user: publicUser(user) });

const register = async ({ userName, email, password }) => {
    email = normalizeEmail(email);
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser && existingUser.isVerified) throw new AppError("An account with this email already exists", 409);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = existingUser
        ? await userRepository.updateById(existingUser._id, { userName: userName.trim(), password: hashedPassword, provider: "local" })
        : await userRepository.createUser({ userName: userName.trim(), email, password: hashedPassword, provider: "local" });

    await otpService.createAndSendOtp(user, "verify-email");
    return user;
};

const sendVerificationOtp = async ({ email }) => {
    const user = await userRepository.findByEmail(normalizeEmail(email));
    if (!user) throw new AppError("User not found", 404);
    if (user.isVerified) throw new AppError("Account is already verified", 400);
    await otpService.createAndSendOtp(user, "verify-email");
};

const verifyAccount = async ({ email, code }) => {
    const user = await otpService.verifyOtp({ email: normalizeEmail(email), code, purpose: "verify-email" });
    if (user.isVerified) throw new AppError("Account is already verified", 400);
    await userRepository.updateById(user._id, { isVerified: true });
};

const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(normalizeEmail(email), true);
    if (!user || user.provider === "google" || !user.password || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Invalid email or password", 401);
    }
    if (!user.isVerified) throw new AppError("Please verify your account before logging in", 403);
    return authResult(user);
};

const loginWithGoogle = async ({ idToken }) => {
    if (!process.env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is missing from environment variables");

    let ticket;
    try {
        ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
    } catch {
        throw new AppError("Invalid Google ID token", 401);
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email || payload.email_verified !== true) {
        throw new AppError("Google account must have a verified email address", 401);
    }

    const googleId = payload.sub;
    const email = normalizeEmail(payload.email);
    let user = await userRepository.findByGoogleId(googleId);

    if (!user) {
        const existingByEmail = await userRepository.findByEmail(email);

        if (existingByEmail) {
            user = await userRepository.updateById(existingByEmail._id, {
                googleId,
                profilePicPath: existingByEmail.profilePicPath || payload.picture || null,
                userName: existingByEmail.userName || payload.name || email.split("@")[0],
                isVerified: true
            });
        } else {
            user = await userRepository.createUser({
                userName: payload.name || email.split("@")[0],
                email,
                provider: "google",
                googleId,
                profilePicPath: payload.picture || null,
                isVerified: true
            });
        }
    }

    if (!user) throw new AppError("Could not complete Google login", 500);
    return authResult(user);
};

const forgotPassword = async ({ email }) => {
    const user = await userRepository.findByEmail(normalizeEmail(email));
    if (user && user.provider === "local") await otpService.createAndSendOtp(user, "reset-password");
};

const resetPassword = async ({ email, code, newPassword }) => {
    const user = await otpService.verifyOtp({ email: normalizeEmail(email), code, purpose: "reset-password" });
    if (user.provider === "google") throw new AppError("This account uses Google sign-in", 400);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepository.updateById(user._id, { password: hashedPassword });
};

module.exports = { register, sendVerificationOtp, verifyAccount, login, loginWithGoogle, forgotPassword, resetPassword };
