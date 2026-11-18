const Message = require("./message.model");
const create = (data) => Message.create(data);
const findForReceiver = (receiver) => Message.find({ receiver }).sort({ createdAt: -1 });
module.exports = { create, findForReceiver };
