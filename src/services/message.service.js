const db = require("../models/index");
const { Message } = require("../models");

const saveMessage = async ({ senderId, receiverId, content }) => {
  const requiredFields = { senderId, receiverId, content };

  for (const key in requiredFields) {
    if (!requiredFields[key]) {
      throw new Error(`${key} is required`);
    }
  }

  try {
    const message = await Message.create({
      senderId,
      receiverId,
      content,
    });
    return message;
  } catch (error) {
    throw error;
  }
};

const getMessages = async ({ userId, user1, user2 }) => {
  const requiredFields = { user1, user2 };

  for (const key in requiredFields) {
    if (!requiredFields[key]) {
      throw new Error(`${key} is required`);
    }
  }

  if (!Number.isInteger(user1) || !Number.isInteger(user2)) {
    throw new Error("user1 and user2 must be integers");
  }

  // Check if the userId is one of the participants
  if (userId !== user1 && userId !== user2) {
    throw new Error("Unauthorized");
  }

  try {
    const messages = await Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    if (!messages?.length) throw new Error("No messages found");

    return messages;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveMessage,
  getMessages,
};
