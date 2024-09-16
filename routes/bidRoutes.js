const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const { createBid, deleteBid } = require("../controllers/bidController");
const router = express.Router();

router.post("/create", authenticateToken, createBid);
router.delete("/delete/:id", authenticateToken, deleteBid);

module.exports = router;
