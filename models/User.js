const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
    "Users",
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        // Store userId here
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false,
            allowedValues: ["shipper", "trucker"],
            defaultValue: "trucker"
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            allowedValues: ["verified", "unverified"],
            defaultValue: "unverified"
        }
    }, {
        // Other model options go here
        tableName: "users",
        timestamps: true
    }
)

module.exports = User;