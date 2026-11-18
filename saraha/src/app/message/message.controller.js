const messageService = require("./message.service");

const create = async (req, res) => {
    const message = await messageService.createMessage(req.params.userId, req.body);
    res.status(201).json({ success: true, message: "Message sent", data: message });
};
const getMine = async (req, res) => {
    const messages = await messageService.getMyMessages(req.user._id);
    res.status(200).json({ success: true, results: messages.length, data: messages });
};

module.exports = { create, getMine };
