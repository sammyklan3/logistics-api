"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
      this.belongsTo(models.User, { foreignKey: "receiverId", as: "receiver" });
      this.belongsTo(models.Shipment, { foreignKey: "shipmentId" });
    }
  }
  Message.init(
    {
      senderId: { type: DataTypes.INTEGER, allowNull: false },
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      shipmentId: DataTypes.INTEGER,
      content: { type: DataTypes.TEXT, allowNull: false },
      read: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "Message" }
  );
  return Message;
};
