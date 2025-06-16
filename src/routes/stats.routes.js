const express = require("express");
const { getStatsController } = require("../controllers/stats.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// @desc Get user stats
// @route GET /api/stats
router.get("/", authMiddleware, getStatsController);

module.exports = router;
