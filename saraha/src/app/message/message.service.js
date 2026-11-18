const messageRepository = require("./message.repository");
const AppError = require("../../common/errors/appError");

const createMessage = async (receiverId, data) =>
    messageRepository.create({ ...data, receiver: receiverId });

const getMyMessages = async (userId) => messageRepository.findForReceiver(userId);

module.exports = { createMessage, getMyMessages };
