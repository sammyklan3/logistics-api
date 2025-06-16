"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Vehicle extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });
    }
  }
  Vehicle.init(
    {
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
      type: DataTypes.STRING,
      plateNumber: { type: DataTypes.STRING, unique: true },
      capacity: DataTypes.FLOAT,
    },
    { sequelize, modelName: "Vehicle" }
  );
  return Vehicle;
};
