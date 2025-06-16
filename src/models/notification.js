"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Notification.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      type: DataTypes.STRING,
      message: DataTypes.TEXT,
      read: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "Notification" }
  );
  return Notification;
};
