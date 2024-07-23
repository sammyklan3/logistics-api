const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const User = require("./User");

const Driver = sequelize.define(
    "Driver",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            allowNull: false,
            unique: true,
            onDelete: 'CASCADE'
        },

        licenseNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },

        vehicleType: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
    timestamps: true
});

Driver.belongsTo(User, {
    foreignKey: {
        allowNull: false,
    },

    onDelete: "CASCADE"
});

module.exports = Driver;