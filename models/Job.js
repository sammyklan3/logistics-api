const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ShipperProfile = require("./ShipperProfile");

const Job = sequelize.define("Job", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    shipper_id: {
        type: DataTypes.UUID,
        references: {
            model: ShipperProfile,
            key: "id"
        },
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    pickup_location: {
        type: DataTypes.JSON,
        allowNull: false
    },

    dropoff_location: {
        type: DataTypes.JSON,
        allowNull: false
    },

    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    dimensions: {
        type: DataTypes.JSON,
        allowNull: false
    },

    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("open", "in_progress", "completed", "cancelled"),
        defaultValue: "open"
    },

    category: {
        type: DataTypes.ENUM(
            "general_freight", // Standard shipments that don't require special handling.
            "refregirated_goods", // Shipments that require temperature-controlled vehicles (e.g., perishable foods, pharmaceuticals)
            "hazardous_freight", // Transporting materials that are dangerous or require special permits (e.g., chemicals, flammable substances).
            "bulk_cargo", // Large volumes of loose materials (e.g., grains, coal, sand).
            "oversized", // Shipments that are larger or heavier than standard legal limits (e.g., construction equipment, industrial machinery).
            "containerized_cargo", // Standardized cargo containers typically used for intermodal transport.
            "parcel_delivery", // Small packages, often involving multiple stops (e.g., courier services, e-commerce deliveries).
            "express", // Jobs requiring immediate delivery within a tight timeframe (e.g., same-day delivery).
            "livestock_transport", // Moving animals, requiring special vehicles and handling.
            "flatbed_loads", // Cargo that requires a flatbed truck, often used for construction materials, large machinery, etc.
            "auto_transport", // Transportation of vehicles, whether new, used, or damaged.
            "household_goods", // Moving personal items, furniture, and other household belongings (e.g., moving services).
            "LTL", // (Less Than Truckload): Smaller shipments that don’t require a full truckload, often combined with other shipments.
            "medical_supplies", // Specialized transport for medical goods, often requiring careful handling.
            "waste_disposal", // Transporting waste materials, including hazardous and non-hazardous waste.
            "construction_materials", // Delivery of materials to construction sites, such as bricks, cement, and lumber.
            "agricultural_products", // Transporting farm products like grains, fruits, vegetables, and livestock feed.
            "event_equipment", // Moving equipment needed for events, such as stages, lighting, and sound systems.
            "intermodal_transport", // Jobs that involve multiple modes of transport (e.g., rail, sea, and road).
            "oil_and_gas", // Transporting fuel, oil, or gas, which may require special permits and safety protocols.
            "electronics_and_high_value_goods", // Transport of sensitive or high-value items, often requiring extra security.
            "store_deliveries", // Moving goods from warehouses to retail stores, often on a scheduled basis.
        ),
        allowNull: false
    },

    departure_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    expected_delivery_date: {
        type: DataTypes.DATE,
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
    tableName: "jobs",
});

ShipperProfile.hasMany(Job, { foreignKey: "shipper_id", onDelete: "CASCADE" });
Job.belongsTo(ShipperProfile, { foreignKey: "shipper_id" });

module.exports = Job;