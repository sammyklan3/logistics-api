const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// API Routes
app.use("/api", routes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to FreightFlow API!");
});

module.exports = app;
