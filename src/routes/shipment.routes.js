const express = require("express");
const {
  createNewShipment,
  updateShipmentDetails,
  getAllShipments,
  getShipmentDetails,
} = require("../controllers/shipment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getAllShipments);
router.post("/", authMiddleware, createNewShipment);
router.put("/:id", authMiddleware, updateShipmentDetails);
router.get("/:id", authMiddleware, getShipmentDetails);

module.exports = router;
