"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Bid extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "driverId", as: "driver" });
      this.belongsTo(models.Shipment, { foreignKey: "shipmentId" });
    }
  }
  Bid.init(
    {
      shipmentId: { type: DataTypes.INTEGER, allowNull: false },
      driverId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      status: DataTypes.ENUM("pending", "accepted", "rejected"),
    },
    { sequelize, modelName: "Bid" }
  );
  return Bid;
};
