const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { createJob } = require("../controllers/jobController");
const router = express.Router();

router.post("/create", authenticateToken, createJob);

module.exports = router;