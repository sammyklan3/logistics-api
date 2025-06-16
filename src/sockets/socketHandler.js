const { saveMessage } = require("../services/message.service");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_private", ({ userId }) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on("private_message", async (data) => {
      const { senderId, receiverId, content } = data;

      // Save message to DB
      const savedMessage = await saveMessage({
        senderId,
        receiverId,
        content,
      });

      // Emit to the receiver's room
      io.to(`user_${receiverId}`).emit("receive_message", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
