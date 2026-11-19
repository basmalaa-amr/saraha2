const User = require("./user.model");

const findByEmail = (email, includePassword = false) => {
    const query = User.findOne({ email: String(email).toLowerCase(), isDeleted: false });
    if (includePassword) query.select("+password");
    return query;
};
const findByGoogleId = (googleId) => User.findOne({ googleId, isDeleted: false }).select("+googleId");
const createUser = (data) => User.create(data);
const findById = (id) => User.findOne({ _id: id, isDeleted: false });
const updateById = (id, updates) => User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updates },
    { new: true, runValidators: true }
);

module.exports = { findByEmail, findByGoogleId, createUser, findById, updateById };
