const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./User");

const Shipper = sequelize.define(
    "Shipper",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        timestamps: true,
    }
);

Shipper.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: "CASCADE",
});

module.exports = Shipper;