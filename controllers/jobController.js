const Job = require("../models/Job");
const User = require("../models/User");
const ShipperProfile = require("../models/ShipperProfile");
const Loan = require("../models/Loan");
const sequelize = require("../config/database");
const errorHandler = require("../middleware/errorHandler");
require("dotenv").config();

const categoryEnum = [
    "general_freight", // Standard shipments that don't require special handling.
    "refregirated_goods", // Shipments that require temperature-controlled vehicles (e.g., perishable foods, pharmaceuticals)
    "hazardous_freight", // Transporting materials that are dangerous or require special permits (e.g., chemicals, flammable substances).
    "bulk_cargo", // Large volumes of loose materials (e.g., grains, coal, sand).
    "oversized", // Shipments that are larger or heavier than standard legal limits (e.g., construction equipment, industrial machinery).
    "containerized_cargo", // Standardized cargo containers typically used for intermodal transport.
    "parcel_delivery", // Small packages, often involving multiple stops (e.g., courier services, e-commerce deliveries).
    "express", // Jobs requiring immediate delivery within a tight timeframe (e.g., same-day delivery).
    "livestock_transport", // Moving animals, requiring special vehicles and handling.
    "flatbed_loads", // Cargo that requires a flatbed truck, often used for construction materials, large machinery, etc.
    "auto_transport", // Transportation of vehicles, whether new, used, or damaged.
    "household_goods", // Moving personal items, furniture, and other household belongings (e.g., moving services).
    "LTL", // (Less Than Truckload): Smaller shipments that don’t require a full truckload, often combined with other shipments.
    "medical_supplies", // Specialized transport for medical goods, often requiring careful handling.
    "waste_disposal", // Transporting waste materials, including hazardous and non-hazardous waste.
    "construction_materials", // Delivery of materials to construction sites, such as bricks, cement, and lumber.
    "agricultural_products", // Transporting farm products like grains, fruits, vegetables, and livestock feed.
    "event_equipment", // Moving equipment needed for events, such as stages, lighting, and sound systems.
    "intermodal_transport", // Jobs that involve multiple modes of transport (e.g., rail, sea, and road).
    "oil_and_gas", // Transporting fuel, oil, or gas, which may require special permits and safety protocols.
    "electronics_and_high_value_goods", // Transport of sensitive or high-value items, often requiring extra security.
    "store_deliveries", // Moving goods from warehouses to retail stores, often on a scheduled basis.
];

// Job creation
const createJob = async (req, res) => {
    const { description, pickupLocation, title, dropoffLocation, salary, departureDate, expectedDeliveryDate, dimensions, weight, category } = req.body;

    // Get the shipper's ID from the request context
    const userId = req.user.id;

    // Start a transaction
    const transaction = await sequelize.transaction();

    // Validate required fields
    const requiredFields = [description, title, pickupLocation, dropoffLocation, salary, departureDate, expectedDeliveryDate, dimensions, weight, category];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Using the userId, get the shipper's ID from the shipper's table
    const shipper = await ShipperProfile.findOne({ where: { user_id: userId }, transaction });
    const shipper_id = shipper.id;
    if (!shipper_id) {
        return res.status(404).json({ message: "Shipper not found" });
    }

    // Check if the shipper has enough tokens to create a job
    if (shipper.tokens < process.env.SHIPPER_JOB_CREATION_COST) {
        return res.status(403).json({ message: "Insufficient tokens to create a job" });
    }

    // Check if the category is valid
    if (!categoryEnum.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
    }

    if (req.user.role !== "shipper") {
        return res.status(403).json({ message: "Only shippers can create jobs" });
    }

    try {
        // Create a new job
        const job = await Job.create({
            description,
            shipper_id,
            title,
            dimensions,
            pickup_location: pickupLocation,
            dropoff_location: dropoffLocation,
            salary,
            departure_date: departureDate,
            expected_delivery_date: expectedDeliveryDate,
            weight,
            category,
        }, { transaction });

        // Subtract the number of tokens from the shipper's account
        const shipper = await User.findOne({ where: { id: userId }, transaction });
        shipper.tokens -= process.env.SHIPPER_JOB_CREATION_COST;
        await shipper.save({ transaction });

        await transaction.commit();

        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        await transaction.rollback();
        errorHandler(error, res)
    }
};

module.exports = { createJob };