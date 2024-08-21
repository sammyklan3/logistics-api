const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ShipperProfile = require("./ShipperProfile");

const Job = sequelize.define("Job", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    shipper_id: {
        type: DataTypes.UUID,
        references: {
            model: ShipperProfile,
            key: "id"
        },
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    pickup_location: {
        type: DataTypes.JSON,
        allowNull: false
    },

    dropoff_location: {
        type: DataTypes.JSON,
        allowNull: false
    },

    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    dimensions: {
        type: DataTypes.JSON,
        allowNull: false
    },

    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("open", "in_progress", "completed", "cancelled"),
        defaultValue: "open"
    },

    departure_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    expected_delivery_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
    
}, {
    timestamps: false,
    tableName: "jobs",
});

ShipperProfile.hasMany(Job, { foreignKey: "shipper_id", onDelete: "CASCADE" });
Job.belongsTo(ShipperProfile, { foreignKey: "shipper_id" });

module.exports = Job;