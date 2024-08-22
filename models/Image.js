const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Job = require("./Job");

const Image = sequelize.define("Image", {
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
        allowNull: false
    },
    job_id: {
        type: DataTypes.UUID,
        references: {
            model: Job,
            key: "id"
        },
        allowNull: true // Allow null in case the image is not tied to a job
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: "images"
});

// Associations
User.hasMany(Image, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

Image.belongsTo(User, {
    foreignKey: "user_id"
});

Job.hasMany(Image, {
    foreignKey: "job_id",
    onDelete: "CASCADE"
});

Image.belongsTo(Job, {
    foreignKey: "job_id"
});

module.exports = Image;