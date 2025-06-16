const { User, Shipment } = require("../models");

// Create a new shipment
const createShipment = async (
  userId,
  {
    title,
    origin,
    destination,
    pickupDate,
    deliveryDate,
    status,
    description,
    weight,
    price,
  }
) => {
  // Check if the user is allowed to create a shipment, using the role. Has to be shipper
  const user = await User.findByPk(userId);
  if (!user || user.role !== "shipper") {
    throw new Error("User not authorized to create a shipment");
  }

  // Validate required fields
  const requiredFields = {
    title,
    origin,
    destination,
    pickupDate,
    deliveryDate,
    status,
    description,
    weight,
    price,
  };
  for (const key in requiredFields) {
    if (!requiredFields[key]) {
      throw new Error(`${key} is required`);
    }
  }

  const shipment = await Shipment.create({
    title,
    shipperId: userId,
    origin,
    destination,
    pickupDate,
    deliveryDate,
    status,
    description,
    weight,
    price,
  });

  return shipment;
};

// List all shipments
const getShipments = async () => {
  const shipments = await Shipment.findAll();
  return shipments;
};

// Get shipment details by ID
const getShipmentById = async (shipmentId) => {
  const shipment = await Shipment.findByPk(shipmentId);
  if (!shipment) {
    throw new Error("Shipment not found");
  }
  return shipment;
};

// Update shipment
const updateShipment = async (userId, shipmentId, shipmentDetails) => {
  const shipment = await Shipment.findByPk(shipmentId);
  if (!shipment) throw new Error("Shipment not found");

  // Check if the user owns the shipment
  if (shipment.shipperId !== userId) {
    throw new Error("User not authorized to update this shipment");
  }

  // Update shipment details
  await shipment.update(shipmentDetails);
  return shipment;
};

// Delete shipment
const deleteShipment = async (shipmentId) => {};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
}; // Export the functions
