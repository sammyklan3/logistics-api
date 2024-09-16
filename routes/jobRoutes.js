const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { createJob, updateJob } = require("../controllers/jobController");
const router = express.Router();

router.post("/create", authenticateToken, createJob);
router.patch("/update/:jobId", authenticateToken, updateJob);

module.exports = router;
