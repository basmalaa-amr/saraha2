const jwt = require("jsonwebtoken");
const AppError = require("../common/errors/appError");
const userRepository = require("../user/user.repository");

const authenticate = async (req, res, next) => {
    try {
        const [scheme, token] = String(req.headers.authorization || "").split(" ");
        if (scheme !== "Bearer" || !token) throw new AppError("Authentication required", 401);
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing from environment variables");

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            throw new AppError("Invalid or expired token", 401);
        }

        const user = await userRepository.findById(payload.userId);
        if (!user) throw new AppError("User not found", 401);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;
