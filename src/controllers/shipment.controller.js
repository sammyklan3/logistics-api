const {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
} = require("../services/shipment.service");

const createNewShipment = async (req, res) => {
  const userId = req.user.id;
  const shipmentDetails = req.body;
  try {
    const shipment = await createShipment(userId, shipmentDetails);
    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllShipments = async (req, res) => {
  try {
    const shipments = await getShipments();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShipmentDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await getShipmentById(id);
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateShipmentDetails = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const shipmentDetails = req.body;
  try {
    const shipment = await updateShipment(userId, id, shipmentDetails);
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewShipment,
  updateShipmentDetails,
  getAllShipments,
  getShipmentDetails,
};
