const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const ShipperProfile = sequelize.define("ShipperProfile", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
    },

    company_name: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: "shipper_profiles",
});

User.hasOne(ShipperProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
ShipperProfile.belongsTo(User, { foreignKey: "user_id" });

module.exports = ShipperProfile;