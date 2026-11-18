const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    senderName: { type: String, trim: true, maxlength: 80, default: "Anonymous" }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Message", messageSchema);
