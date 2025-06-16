const express = require("express");
const {
  saveConversation,
  getConversation,
} = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:user1/:user2", authMiddleware, saveConversation);
router.get("/:user1/:user2", authMiddleware, getConversation);

module.exports = router;
