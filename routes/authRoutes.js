const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { register, login, refreshToken, deleteUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.delete("/delete/:userId", authenticateToken ,deleteUser);

module.exports = router;