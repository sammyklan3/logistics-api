const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Driver = require("./Driver");
const Shipper = require("./Shipper");

const Job = sequelize.define(
    "Job",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        shipper_id: {
            type: DataTypes.STRING,
            references: {
                model: Shipper,
                key: "userId"
            },
            allowNull: false
        },

        // driver_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: Driver,
        //         key: "id"
        //     },
        //     defaultValue: null
        // },

        status: {
            type: DataTypes.STRING,
            allowNull: false,
            allowedValues: ["Pending", "Completed"],
            defaultValue: "Pending"
        },

        pickupLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },

        dropoffLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },

        salary: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        departureDate: {
            type: DataTypes.DATE,
            allowNull: false
        },

        expectedDeliveryDate: {
            type: DataTypes.DATE,
            allowNull: false
        },

        weight: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, {
    timestamps: true,
}
);

// Job.belongsTo(Driver, {
//     foreignKey: {
//         allowNull: false,
//     },
//     onDelete: "CASCADE",
// });

Job.belongsTo(Shipper, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: "CASCADE",
});

module.exports = Job;