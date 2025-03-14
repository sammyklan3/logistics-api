const express = require("express");
const http = require("http");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const bidRoutes = require("./routes/bidRoutes");
const limiter = require("./middleware/rate-limiter");

const app = express();
const server = http.createServer(app);

const morgan = require("morgan");
const cluster = require("cluster");
const cors = require("cors");
const os = require("os");
const compression = require("compression");
const syncDatabase = require("./models/index");
const port = 3000;

// Use node.js cluster configuration to take advantage of multi-core systems
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  app.use(express.json());

  // Compress responses
  app.use(compression());

  // Enable CORS
  app.use(cors());

  // Apply rate limiter to all requests
  app.use(limiter);

  // Sync the database
  syncDatabase();

  app.get("/", (req, res) => {
    res.send("Welcome to the Job Portal API");
  });

  // Use morgan to log requests to the console
  app.use(morgan("combined"));

  app.use("/auth", authRoutes);
  app.use("/job", jobRoutes);
  app.use("/profile", userRoutes);
  app.use("/bid", bidRoutes);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Graceful shutdown handler
  const shutdown = () => {
    console.log("Shutting down gracefully...");

    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });

    // Force exit if not closed in 5 seconds
    setTimeout(() => {
      console.error("Forcing shutdown...");
      process.exit(1);
    }, 5000);
  };

  // Listen for termination signals
  process.on("SIGINT", shutdown); // Ctrl+C
  process.on("SIGTERM", shutdown); // Kill signal
}
