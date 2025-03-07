const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    shipper_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    pickup_location: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    dropoff_location: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    dimensions: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("open", "in_progress", "completed", "cancelled"),
      defaultValue: "open",
    },

    category: {
      type: DataTypes.ENUM(
        "general_freight",
        "refregirated_goods",
        "hazardous_freight",
        "bulk_cargo",
        "oversized",
        "containerized_cargo",
        "parcel_delivery",
        "express",
        "livestock_transport",
        "flatbed_loads",
        "auto_transport",
        "household_goods",
        "LTL",
        "medical_supplies",
        "waste_disposal",
        "construction_materials",
        "agricultural_products",
        "event_equipment",
        "intermodal_transport",
        "oil_and_gas",
        "electronics_and_high_value_goods",
        "store_deliveries"
      ),
      allowNull: false,
    },

    departure_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    expected_delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "jobs",
  }
);

// Define relationships
User.hasMany(Job, { foreignKey: "shipper_id", onDelete: "CASCADE" });
Job.belongsTo(User, { foreignKey: "id" });

module.exports = Job;