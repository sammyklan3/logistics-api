const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Job = require("./Job");

const Rating = sequelize.define("Rating", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    reviewer_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
    },

    reviewee_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
    },

    job_id: {
        type: DataTypes.UUID,
        references: {
            model: Job,
            key: "id"
        },
        allowNull: false,
    },

    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },

    review: {
        type: DataTypes.TEXT,
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
    tableName: "ratings"
});

User.hasMany(Rating, { foreignKey: "reviewer_id", as: "reviewer" });
Rating.belongsTo(User, { foreignKey: "reviewer_id", as: "reviewer" });

User.hasMany(Rating, { foreignKey: "reviewee_id", as: "reviewee" });
Rating.belongsTo(User, { foreignKey: "reviewee_id", as: "reviewee" });

Job.hasMany(Rating, { foreignKey: "job_id" });
Rating.belongsTo(Job, { foreignKey: "job_id" });

module.exports = Rating;