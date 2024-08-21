const Job = require("../models/Job");
const User = require("../models/User");
const ShipperProfile = require("../models/ShipperProfile");
const sequelize = require("../config/database");
const Sequelize = require("sequelize");
require("dotenv").config();

// Job creation
const createJob = async (req, res) => {
    const { description, pickupLocation, title, dropoffLocation, salary, departureDate, expectedDeliveryDate, dimensions, weight } = req.body;

    // Get the shipper's ID from the request context
    const userId = req.user.id;

    // Start a transaction
    const transaction = await sequelize.transaction();

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
    
    // Validate required fields
    const requiredFields = [description, title,  pickupLocation, dropoffLocation, salary, departureDate, expectedDeliveryDate, dimensions, weight];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if(req.user.role !== "shipper") {
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
        }, { transaction });

        // Subtract the number of tokens from the shipper's account
        const shipper = await User.findOne({ where: { id: userId }, transaction });
        shipper.tokens -= process.env.SHIPPER_JOB_CREATION_COST;
        await shipper.save({ transaction });

        await transaction.commit();

        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { createJob };