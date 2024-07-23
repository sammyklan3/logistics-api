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

        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id"
            },
            allowNull: false,
            unique: true,
            onDelete: "CASCADE"
        },

        companyName: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
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