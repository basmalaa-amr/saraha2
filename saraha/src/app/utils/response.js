const publicUser = (user) => ({
    id: user._id,
    userName: user.userName,
    email: user.email,
    profilePicPath: user.profilePicPath,
    provider: user.provider,
    isVerified: user.isVerified
});

module.exports = { publicUser };
