const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const router = express.Router();

router.post("/create", authenticateToken, createJob);
router.patch("/update/:id", authenticateToken, updateJob);
router.delete("/delete/:id", authenticateToken, deleteJob);

module.exports = router;
