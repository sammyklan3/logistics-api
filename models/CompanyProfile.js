const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const CompanyProfile = sequelize.define("CompanyProfile", {
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

    fleet_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
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
    tableName: "company_profiles",
});

User.hasOne(CompanyProfile, { foreignKey: "user_id" });
CompanyProfile.belongsTo(User, { foreignKey: "user_id" });

module.exports = CompanyProfile;