const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Job = require("./Job");
const User = require("./User");

const JobAssignment = sequelize.define("JobAssignment", {
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

    assignee_id: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
    },

    assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
    tableName: "job_assignments"
});

Job.hasOne(JobAssignment, { foreignKey: "job_id" });
JobAssignment.belongsTo(Job, { foreignKey: "job_id" });

User.hasMany(JobAssignment, { foreignKey: "assignee_id" });
JobAssignment.belongsTo(User, { foreignKey: "assignee_id" });

module.exports = JobAssignment;