const express = require("express");
const {
  register,
  login,
  getUser,
  update,
  deleteUser,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// @desc Register a new user
// @route POST /api/auth/register

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getUser);
router.put("/profile", authMiddleware, update);
router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
