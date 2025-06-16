"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Shipment extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "shipperId", as: "shipper" });
      this.hasMany(models.Bid, { foreignKey: "shipmentId" });
      this.hasMany(models.Message, { foreignKey: "shipmentId" });
      this.hasOne(models.Bid, { foreignKey: "shipmentId", as: "acceptedBid" });
    }
  }
  Shipment.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Untitled Shipment",
      },
      shipperId: { type: DataTypes.INTEGER, allowNull: false },
      origin: { type: DataTypes.STRING, allowNull: false },
      destination: { type: DataTypes.STRING, allowNull: false },
      pickupDate: { type: DataTypes.DATE, allowNull: false },
      deliveryDate: DataTypes.DATE,
      status: DataTypes.ENUM("pending", "in_progress", "completed", "canceled"),
      description: DataTypes.TEXT,
      weight: DataTypes.FLOAT,
      price: DataTypes.FLOAT,
    },
    { sequelize, modelName: "Shipment" }
  );
  return Shipment;
};
