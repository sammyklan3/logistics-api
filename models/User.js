const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.ENUM("driver", "company", "shipper"),
        allowNull: false
    },

    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },

    profile_picture: {
        type: DataTypes.STRING,
        defaultValue: "default.jpg"
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    timestamps: false,
    tableName: "users",
});

module.exports = User;