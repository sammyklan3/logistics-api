const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const DriverProfile = sequelize.define(
  "DriverProfile",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },

    license_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    vehicle_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "driver_profiles",
  }
);

User.hasOne(DriverProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
DriverProfile.belongsTo(User, { foreignKey: "user_id" });

module.exports = DriverProfile;
