const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Job = require("./Job");
const User = require("./User");

const Bid = sequelize.define("Bid", {
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

    bidder_id: {
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
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
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
    tableName: "bids"
});

Job.hasMany(Bid, { foreignKey: "job_id" });
Bid.belongsTo(Job, { foreignKey: "job_id" });

User.hasMany(Bid, { foreignKey: "bidder_id" });
Bid.belongsTo(User, { foreignKey: "bidder_id" });

module.exports = Bid;