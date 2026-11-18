const userRepository = require("./user.repository");
const AppError = require("../../common/errors/appError");

const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
};

module.exports = { getProfile };
