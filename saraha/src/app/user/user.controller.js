const userService = require("./user.service");
const { publicUser } = require("../utils/response");

const getProfile = async (req, res) => {
    const user = await userService.getProfile(req.user._id);
    res.status(200).json({ success: true, data: publicUser(user) });
};

module.exports = { getProfile };
