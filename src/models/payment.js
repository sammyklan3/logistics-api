"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      this.belongsTo(models.Shipment, { foreignKey: "shipmentId" });
      this.belongsTo(models.User, { foreignKey: "payerId", as: "payer" });
      this.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
    }
  }
  Payment.init(
    {
      shipmentId: { type: DataTypes.INTEGER, allowNull: false },
      payerId: { type: DataTypes.INTEGER, allowNull: false },
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        allowNull: false,
      },
      transactionId: { type: DataTypes.STRING, unique: true },
      paymentMethod: {
        type: DataTypes.ENUM("card", "bank_transfer", "cash"),
        allowNull: false,
      },
    },
    { sequelize, modelName: "Payment" }
  );
  return Payment;
};
