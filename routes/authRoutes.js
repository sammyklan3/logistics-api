const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { register, login, refreshToken, deleteUser, updateUserProfile } = require("../controllers/authController");
const router = express.Router();
const upload = require("../middleware/fileHandler");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.delete("/delete/:userId", authenticateToken ,deleteUser);
router.patch("/update/:userId", authenticateToken, upload.single("image"), updateUserProfile);

module.exports = router;