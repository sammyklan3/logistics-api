const User = require("../models/User");
const Job = require("../models/Job");
const JobAssignment = require("../models/JobAssignment");
const errorHandler = require("../middleware/errorHandler");

// Get dashboard data
const getDashboardData = async (req, res) => {
  const { id } = req.user;

  try {
    // Check if the user is a shipper or a transporter
    const user = await User.findByPk(id);

    if (user.role === "shipper") {
      // Get total expenses and total jobs posted
      const totalExpenses = await Job.sum("salary", {
        where: { shipper_id: id },
      });

      const totalJobs = await Job.count({
        where: { shipper_id: id },
      });

      // Get active jobs for the shipper (status = "in_progress")
      const activeJobs = await Job.count({
        where: { shipper_id: id, status: "in_progress" },
      });

      return res.json({ totalExpenses, totalJobs, activeJobs });
    } else if (user.role === "driver") {
      // Get total earnings
      const totalEarnings = await JobAssignment.findAll({
        attributes: [
          [
            Job.sequelize.fn("SUM", Job.sequelize.col("Job.salary")),
            "totalEarnings",
          ],
        ],
        include: [
          {
            model: Job,
            attributes: [],
          },
        ],
        where: { assignee_id: id },
        raw: true,
      });

      // Get recent 5 jobs completed by the driver
      const recentJobs = await JobAssignment.findAll({
        attributes: ["job_id", "completed_at"],
        where: { assignee_id: id },
        include: [
          {
            model: Job,
            attributes: ["title", "salary"],
          },
        ],
        order: [["completed_at", "DESC"]],
        limit: 5,
      });

      // Get active jobs for the driver (status = "in_progress")
      const activeJobs = await JobAssignment.count({
        include: [
          {
            model: Job,
            attributes: [],
            where: { status: "in_progress" },
          },
        ],
        where: { assignee_id: id },
      });

      return res.json({
        totalEarnings: totalEarnings[0]?.totalEarnings || 0,
        recentJobs,
        activeJobs,
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (err) {
    errorHandler(err, res);
  }
};

// Get user info
const getUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out sensitive information
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tokens: user.tokens,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.status(200).json(userData);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = { getUser, getDashboardData };
