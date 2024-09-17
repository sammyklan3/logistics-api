const Job = require("../models/Job");
const JobAssignment = require("../models/JobAssignment");
const User = require("../models/User");
const ShipperProfile = require("../models/ShipperProfile");
const Loan = require("../models/Loan");
const sendEmail = require("../services/mailService");
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
  const {
    description,
    pickupLocation,
    title,
    dropoffLocation,
    salary,
    departureDate,
    expectedDeliveryDate,
    dimensions,
    weight,
    category,
  } = req.body;

  // Get the shipper's ID from the request context
  const userId = req.user.id;

  // Check the user's role
  if (req.user.role !== "shipper") {
    return res
      .status(403)
      .json({ message: "You're not authorized to perform this action" });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  // Validate required fields
  const requiredFields = [
    description,
    title,
    pickupLocation,
    dropoffLocation,
    salary,
    departureDate,
    expectedDeliveryDate,
    dimensions,
    weight,
    category,
  ];
  if (requiredFields.some((field) => !field)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Using the userId, get the shipper's ID from the shipper's table
  const shipperProfile = await ShipperProfile.findOne({
    where: { user_id: userId },
    transaction,
  });
  console.log(shipperProfile);
  const shipper_id = shipperProfile.id;

  if (!shipper_id) {
    return res.status(404).json({ message: "Shipper not found" });
  }

  // Check if the shipper has enough tokens to create a job
  const jobCreationCost = parseInt(process.env.SHIPPER_JOB_CREATION_COST, 10);
  if (isNaN(jobCreationCost)) {
    return res
      .status(500)
      .json({ message: "Job creation cost is not configured properly" });
  }

  // Get amount of tokens from the User's profile
  const user = await User.findByPk(userId, { transaction });
  if (user.tokens < jobCreationCost) {
    // Check if the shipper has an active loan
    const activeLoan = await Loan.findOne({
      where: { user_id: user.id, status: "disbursed" },
      transaction,
    });

    if (!activeLoan) {
      return res
        .status(400)
        .json({ message: "Insufficient tokens. Please request a loan" });
    } else {
      return res
        .status(400)
        .json({ message: "Insufficient tokens. You have an active loan" });
    }
  }

  // Check if the category is valid
  if (!categoryEnum.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  try {
    // Create a new job
    const job = await Job.create(
      {
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
      },
      { transaction }
    );

    // Subtract the number of tokens from the shipper's account
    user.tokens -= process.env.SHIPPER_JOB_CREATION_COST;
    await user.save({ transaction });

    await transaction.commit();

    return res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    await transaction.rollback();
    errorHandler(error, res);
  }
};

// Job updates/modifications
const updateJob = async (req, res) => {
  const {
    description,
    pickupLocation,
    dropoffLocation,
    salary,
    departureDate,
    expectedDeliveryDate,
    dimensions,
    weight,
    category,
  } = req.body;

  // Get the job ID from the request parameters
  const jobId = req.params.id;

  // Start a transaction
  const transaction = await sequelize.transaction();

  // check if the job exists
  const job = await Job.findByPk(jobId, { transaction });
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  //  Use the middleware's user.id to find shipper's id
  const userId = req.user.id;
  const shipperProfile = await ShipperProfile.findOne({
    where: { user_id: userId },
    transaction,
  });
  const shipper_id = shipperProfile.id;

  // Check if the user is authorized to update the job
  if (job.shipper_id !== shipper_id) {
    return res
      .status(403)
      .json({ message: "You're not authorized to update this job" });
  }

  try {
    // Update the job with the provided fields
    await job.update(
      {
        description,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        salary,
        departure_date: departureDate,
        expected_delivery_date: expectedDeliveryDate,
        dimensions,
        weight,
        category,
      },
      { transaction }
    );

    // Notify drivers subscribed to the job that it has been updated
    const jobAssignments = await JobAssignment.findAll({
      where: { job_id: jobId },
      transaction,
    });
    jobAssignments.forEach(async (assignment) => {
      const driver = await User.findByPk(assignment.assignee_id, {
        transaction,
      });
      // Send a notification to the driver
      sendEmail(
        driver.email,
        "Job Update",
        `The job ${job.id} has been updated. Please check the details on the platform`,
        `<p>The job ${job.id} has been updated. Please check the details on the platform</p>`
      );
      console.log(`Driver ${driver.id} has been notified about the job update`);
    });

    await transaction.commit();

    return res
      .status(200)
      .json({ message: `Job ${job.id} has been successfully updated`, job });
  } catch (error) {
    await transaction.rollback();
    errorHandler(error, res);
  }
};

// Job deletion
const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  // Start a transaction
  const transaction = await sequelize.transaction();

  // Check if the job exists
  const job = await Job.findByPk(jobId, { transaction });
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // Use the middleware's user.id to find shipper's id
  const userId = req.user.id;
  const shipperProfile = await ShipperProfile.findOne({
    where: { user_id: userId },
    transaction,
  });
  const shipper_id = shipperProfile.id;

  // Check if the user is authorized to delete the job
  if (job.shipper_id !== shipper_id) {
    return res
      .status(403)
      .json({ message: "You're not authorized to delete this job" });
  }

  // Check if the job is already in progress (assigned to a driver)
  if (job.status === "in_progress") {
    return res
      .status(400)
      .json({ message: "Cannot delete a job that is already in progress" });
  }

  try {
    // Delete the job
    await job.destroy({ transaction });
    await transaction.commit();
    return res.status(200).json({ message: `Job ${jobId} has been deleted` });
  } catch (err) {
    await transaction.rollback();
    errorHandler(err, res);
  }
};

module.exports = { createJob, updateJob, deleteJob };
