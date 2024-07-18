const sequelize = require("../config/config");
const { DataTypes } = require("sequelize");

const Job = sequelize.define(
    "Job",
    {
        // Model attributes go here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        user: {
            type: DataTypes.INTEGER,
            references:
            {
                model: "User",
                key: "id"
            }
        },

        weight: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        vehicle_provided: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        vehicle_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Vehicle",
                key: "id"
            },
            defaultValue: null
        },

        driver_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: "id"
            },
            defaultValue: null
        },

        depature: {
            type: DataTypes.STRING,
            allowNull: false
        },

        destination: {
            type: DataTypes.STRING,
            allowNull: false
        },

        eta: {
            type: DataTypes.DATE,
            defaultValue: null
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            allowedValues: ["pending", "accepted", "completed", "cancelled"],
            defaultValue: "pending"
        }
    }
);