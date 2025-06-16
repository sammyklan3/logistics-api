const express = require("express");
const authRoutes = require("./auth.routes");
const statsRoutes = require("./stats.routes");
const shipmentRoutes = require("./shipment.routes");
const messageRoutes = require("./message.routes");

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/stats", statsRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
