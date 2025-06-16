require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { Server } = require("socket.io");
const socketHandler = require("./src/sockets/socketHandler");
const { sequelize } = require("./src/models");

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Pass io instance to socketHandler
socketHandler(io);

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Start Express server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
