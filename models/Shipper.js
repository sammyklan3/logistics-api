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
            type: DataTypes.STRING,
            references: {
                model: User,
                key: "userId"
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
        tableName: "shippers",
    }
);

Shipper.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: "CASCADE",
});

module.exports = Shipper;