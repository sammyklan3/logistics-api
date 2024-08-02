const express = require("express");
const authRoutes = require("./routes/authRoutes");
const app = express();
const morgan = require("morgan");
const cluster = require("cluster");
const cors = require("cors");
const os = require("os");
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

    // Enable CORS
    app.use(cors());

    // Sync the database
    syncDatabase();

    // Use morgan to log requests to the console
    app.use(morgan("combined"));

    app.use("/auth", authRoutes);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}