const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
  register,
  login,
  refreshToken,
  deleteUser,
  updateUserProfile,
  fogortPassword,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();
const upload = require("../middleware/fileHandler");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", fogortPassword);
router.post("/reset-password", resetPassword);
router.delete("/delete", authenticateToken, deleteUser);
router.patch(
  "/update",
  authenticateToken,
  upload.single("file"),
  updateUserProfile
);

module.exports = router;
