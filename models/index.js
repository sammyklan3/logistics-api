const sequelize = require("../config/database");
const User = require("./User");
const Job = require("./Job");
const ShipperProfile = require("./ShipperProfile");
const CompanyProfile = require("./CompanyProfile");
const JobAssignment = require("./JobAssignment");
const Payment = require("./Payment");
const Rating = require("./Rating");
const Token = require("./Token");

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