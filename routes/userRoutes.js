const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { getUser } = require("../controllers/userController");
const router = express.Router();
const upload = require("../middleware/fileHandler");

router.get("/", authenticateToken, getUser);

module.exports = router;
