const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const otpRepository = require("./otp.repository");
const userRepository = require("../user/user.repository");
const { sendOtpEmail } = require("../../config/email");
const AppError = require("../../common/errors/appError");

const generateCode = () => crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

const createAndSendOtp = async (user, purpose) => {
    const cooldownSeconds = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
    const latestOtp = await otpRepository.findLatest(user._id, purpose);
    if (latestOtp) {
        const elapsed = (Date.now() - latestOtp.createdAt.getTime()) / 1000;
        if (elapsed < cooldownSeconds) {
            throw new AppError(`Please wait ${Math.ceil(cooldownSeconds - elapsed)} seconds before requesting another code`, 429);
        }
    }

    const plainCode = generateCode();
    const hashedCode = await bcrypt.hash(plainCode, 10);
    const expiresInMinutes = Number(process.env.OTP_EXPIRES_IN_MINUTES || 10);

    await otpRepository.deleteForUser(user._id, purpose);
    await otpRepository.createOtp({
        code: hashedCode,
        userId: user._id,
        purpose,
        expireAt: new Date(Date.now() + expiresInMinutes * 60 * 1000)
    });

    try {
        await sendOtpEmail({ to: user.email, code: plainCode, purpose });
    } catch (error) {
        await otpRepository.deleteForUser(user._id, purpose);
        throw new AppError("Could not send the email. Check your email configuration.", 500);
    }
};

const verifyOtp = async ({ email, code, purpose }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid email or code", 400);

    const otp = await otpRepository.findLatest(user._id, purpose);
    if (!otp || otp.expireAt.getTime() <= Date.now()) throw new AppError("Code is invalid or expired", 400);
    if (!(await bcrypt.compare(String(code), otp.code))) throw new AppError("Code is invalid or expired", 400);

    await otpRepository.deleteById(otp._id);
    return user;
};

module.exports = { createAndSendOtp, verifyOtp };
