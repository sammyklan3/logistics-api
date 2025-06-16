"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Assignment extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "driverId", as: "driver" });
      this.belongsTo(models.Shipment, {
        foreignKey: "shipmentId",
        as: "shipment",
      });
    }
  }
  Assignment.init(
    {
      shipmentId: { type: DataTypes.INTEGER, allowNull: false },
      driverId: { type: DataTypes.INTEGER, allowNull: false },
      assignedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "Assignment" }
  );
  return Assignment;
};
