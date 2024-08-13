const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Transaction = sequelize.define(
    "Transactions",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        transaction_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },

        payment_method: {
            type: DataTypes.STRING,
            allowNull: false,
            allowedValues: ["MPESA", "cash", "card"]
        }
    }, {
        // Other model options go here
        tableName: "transactions",
        timestamps: true
    }
);