const Job = require("../models/Job");
const Bid = require("../models/Bid");
const User = require("../models/User");
const ShipperProfile = require("../models/ShipperProfile");
const Loan = require("../models/Loan");
const sendEmail = require("../services/mailService");
const sequelize = require("../config/database");
const errorHandler = require("../middleware/errorHandler");
require("dotenv").config();

// Bid creation
const createBid = async (req, res) => {
  const { amount, job_id } = req.body;

  if (!amount || !job_id) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the job exists
    const job = await Job.findByPk(job_id, { transaction });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.role !== "driver") {
      return res
        .status(403)
        .json({ message: "You are not authorized to place a bid" });
    }

    // Use the middleware's user.id to find driver's id
    const userId = req.user.id;
    const driverProfile = await User.findOne({
      where: { id: userId },
      transaction,
    });
    const driver_id = driverProfile.id;

    // Check if the driver has already placed a bid for the job
    const existingBid = await Bid.findOne({
      where: { bidder_id: driver_id, job_id },
      transaction,
    });
    if (existingBid) {
      return res.status(400).json({
        message: "You have already placed a bid for this job",
      });
    }

    // Parse the bid fee into integer
    const bidFee = parseInt(process.env.BID_FEE, 10);
    if (isNaN(bidFee)) {
      return res
        .status(500)
        .json({ message: "Job creation cost is not configured properly" });
    }

    // Check if the driver has enough tokens to place a bid
    if (driverProfile.tokens < bidFee) {
      return res.status(400).json({
        message: "You do not have enough tokens to place a bid",
      });
    }

    // Create the bid
    const bid = await Bid.create(
      {
        amount,
        job_id,
        bidder_id: driver_id,
      },
      { transaction }
    );

    // Subtract token fee required to place a bid
    driverProfile.tokens -= bidFee;
    await driverProfile.save({ transaction });

    // Notify the shipper that a bid has been placed
    const shipperProfile = await ShipperProfile.findByPk(job.shipper_id, {
      transaction,
    });
    const shipper = await User.findByPk(shipperProfile.user_id, {
      transaction,
    });
    sendEmail(
      shipper.email,
      "Bid Placed",
      `A bid has been placed for the job ${job.id}. Please check the details on the platform`,
      `<p>A bid has been placed for the job ${job.id}. Please check the details on the platform</p>`
    );
    console.log(`Shipper ${shipper.id} has been notified about the bid`);

    await transaction.commit();

    return res
      .status(201)
      .json({ message: "Bid has been successfully placed", bid });
  } catch (error) {
    await transaction.rollback();
    errorHandler(error, res);
  }
};

// Delete a bid
const deleteBid = async (req, res) => {
  const { id } = req.params;

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if the bid exists
    const bid = await Bid.findByPk(id, { transaction });
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Check if the user is authorized to delete the bid
    if (req.user.id !== bid.bidder_id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this bid" });
    }

    // Check if the job has already been assigned
    const job = await Job.findByPk(bid.job_id, { transaction });
    if (job.assigned_to) {
      return res
        .status(400)
        .json({ message: "This job has already been assigned" });
    }

    // Parse the bid fee into integer
    const bidFee = parseInt(process.env.BID_FEE, 10);
    if (isNaN(bidFee)) {
      return res
        .status(500)
        .json({ message: "Job creation cost is not configured properly" });
    }

    // Delete the bid
    await bid.destroy({ transaction });

    // Refund the bid fee to the driver
    const driverProfile = await User.findByPk(bid.bidder_id, {
      transaction,
    });
    driverProfile.tokens += bidFee;
    await driverProfile.save({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: "Bid has been deleted" });
  } catch (error) {
    await transaction.rollback();
    errorHandler(error, res);
  }
};

module.exports = { createBid, deleteBid };
