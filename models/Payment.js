const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Job = require("./Job");
const User = require("./User");

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    job_id: {
        type: DataTypes.UUID,
        references: {
            model: Job,
            key: "id"
        },
        allowNull: false,
    },

    payer_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
    },

    payee_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
    },

    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
    },

    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
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
    tableName: "payments"
});

Job.hasMany(Payment, { foreignKey: "job_id" });
Payment.belongsTo(Job, { foreignKey: "job_id" });

User.hasMany(Payment, { foreignKey: "payer_id", as: "payer" });
Payment.belongsTo(User, { foreignKey: "payer_id", as: "payer" });

User.hasMany(Payment, { foreignKey: "payee_id", as: "payee" });
Payment.belongsTo(User, { foreignKey: "payee_id", as: "payee" });

module.exports = Payment;