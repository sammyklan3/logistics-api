const Job = require("../models/Job");
const User = require("../models/User");
const sequelize = require("../config/database");
const Sequelize = require("sequelize");
require("dotenv").config();

// Job creation
const createJob = async (req, res) => {
    const { description, pickupLocation, dropoffLocation, salary, departureDate, expectedDeliveryDate, weight } = req.body;

    // Get the shipper's ID from the request context
    const shipper_id = req.user.userId;

    console.log(shipper_id);
    
    // Validate required fields
    const requiredFields = [description, shipper_id, pickupLocation, dropoffLocation, salary, departureDate, expectedDeliveryDate, weight];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if(req.user.role !== "shipper") {
        return res.status(403).json({ message: "Only shippers can create jobs" });
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Create a new job
        const job = await Job.create({
            description,
            shipper_id,
            pickupLocation,
            dropoffLocation,
            salary,
            departureDate,
            expectedDeliveryDate,
            weight,
            ShipperId: req.user.id
        }, { transaction });

        // Subtract the number of tokens from the shipper's account
        const shipper = await User.findOne({ where: { userId: shipper_id }, transaction });
        shipper.tokens -= process.env.SHIPPER_JOB_CREATION_COST;
        await shipper.save({ transaction });


        await transaction.commit();

        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createJob };