const { Payment, User, Shipment, Bid, Assignment } = require("../models");

const getStats = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const stats = {
    stats: {
      activeJobs: 0,
      availableDrivers: 0,
      revenue: 0,
    },
    recentJobs: [],
    marketInsights: {
      title: "Market Demand",
      description:
        "High demand for refrigerated trucks in the Western region. Average rates up by 12% this week.",
    },
  };

  if (user.role === "shipper") {
    stats.stats.activeJobs = await Shipment.count({
      where: { shipperId: userId },
    });

    stats.stats.revenue =
      (await Payment.sum("amount", { where: { payerId: userId } })) || 0;

    const shipperShipments = await Shipment.findAll({
      where: { shipperId: userId },
      attributes: ["id"],
    });

    const shipmentIds = shipperShipments.map((shipment) => shipment.id);

    stats.stats.availableDrivers = await Bid.count({
      where: { shipmentId: shipmentIds },
    });

    stats.recentJobs = await Shipment.findAll({
      where: { shipperId: userId },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "title", "origin", "destination", "price", "status"],
    });
  }

  if (user.role === "driver") {
    const assignedShipments = await Assignment.findAll({
      where: { driverId: userId },
      attributes: ["shipmentId"],
    });

    const shipmentIds = assignedShipments.map(
      (assignment) => assignment.shipmentId
    );

    stats.stats.activeJobs = shipmentIds.length;

    stats.stats.revenue =
      (await Payment.sum("amount", { where: { receiverId: userId } })) || 0;

    stats.stats.availableDrivers = await Bid.count({
      where: { driverId: userId },
    });

    stats.recentJobs = await Shipment.findAll({
      where: { id: shipmentIds },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "title", "origin", "destination", "price", "status"],
    });
  }

  if (user.role === "admin") {
    stats.stats.activeJobs = await Shipment.count();
    stats.stats.revenue = (await Payment.sum("amount")) || 0;
    stats.stats.availableDrivers = await User.count({
      where: { role: "driver" },
    });
  }

  return stats;
};

module.exports = { getStats };
