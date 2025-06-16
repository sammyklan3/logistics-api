const { getStats } = require("../services/stats.service");

const getStatsController = async (req, res) => {
  try {
    const stats = await getStats(req.user.id);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStatsController };
