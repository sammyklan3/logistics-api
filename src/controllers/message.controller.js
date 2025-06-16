const { saveMessage, getMessages } = require("../services/message.service");

const saveConversation = async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;
  const { senderId, receiverId } = req.params;
  try {
    const message = await saveMessage({
      userId,
      senderId,
      receiverId,
      content,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  const user1 = parseInt(req.params.user1);
  const user2 = parseInt(req.params.user2);
  const userId = req.user.id;

  try {
    const messages = await getMessages({ userId, user1, user2 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveConversation, getConversation };
