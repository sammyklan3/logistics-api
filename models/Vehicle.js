const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Driver = require("./Driver");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Vehicle.belongsTo(Driver, {
  foreignKey: {
    allowNull: false,
  },

  onDelete: "CASCADE",
});

module.exports = Vehicle;
