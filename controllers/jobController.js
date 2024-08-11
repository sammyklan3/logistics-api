const Job = require("../models/Job");
const sequelize = require("../config/database");
const Sequelize = require("sequelize");

// Job creation
const createJob = async (req, res) => {
    const { description, status, pickupLocation, dropoffLocation, salary, depatureDate } = req.body;

    const shipper_id = req.user.userId;

    // Validate required fields
    const requiredFields = [description, shipper_id, status, pickupLocation, dropoffLocation, salary, depatureDate];
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
            status,
            pickupLocation,
            dropoffLocation,
            salary,
            depatureDate
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        await transaction.rollback();
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createJob };