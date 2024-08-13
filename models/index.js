const sequelize = require("../config/database");
const User = require("./User");
const Job = require("./Job");
const Driver = require("./Driver");
const Shipper = require("./Shipper");
const Vehicle = require("./Vehicle");
const Transaction = require("./Transaction");

// Sync all defined models to the database
// TODO: remove this and use migrations
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to sync tables:", error);
    };
};

module.exports = syncDatabase;