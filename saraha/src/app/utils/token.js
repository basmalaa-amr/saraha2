const jwt = require("jsonwebtoken");
const AppError = require("../common/errors/appError");

const signToken = (user) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing from environment variables");
    return jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
};

module.exports = { signToken };
