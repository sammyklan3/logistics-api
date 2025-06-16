"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Shipment, { foreignKey: "shipperId" });
      this.hasMany(models.Bid, { foreignKey: "driverId" });
      this.hasMany(models.Message, {
        foreignKey: "senderId",
        as: "sentMessages",
      });
      this.hasMany(models.Message, {
        foreignKey: "receiverId",
        as: "receivedMessages",
      });
      this.hasMany(models.Payment, {
        foreignKey: "payerId",
        as: "paymentsMade",
      });
      this.hasMany(models.Payment, {
        foreignKey: "receiverId",
        as: "paymentsReceived",
      });
      this.hasMany(models.Rating, {
        foreignKey: "reviewerId",
        as: "givenRatings",
      });
      this.hasMany(models.Rating, {
        foreignKey: "revieweeId",
        as: "receivedRatings",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("shipper", "driver", "company", "admin"),
        allowNull: false,
      },
      phone: DataTypes.STRING,
      profileImage: DataTypes.STRING,
    },
    { sequelize, modelName: "User" }
  );
  return User;
};
