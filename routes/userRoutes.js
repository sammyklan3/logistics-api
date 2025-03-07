const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { getUser, getDashboardData } = require("../controllers/userController");
const router = express.Router();
const upload = require("../middleware/fileHandler");

router.get("/", authenticateToken, getUser);
router.get("/dashboard", authenticateToken, getDashboardData);

module.exports = router;
