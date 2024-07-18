const sequelize = require("../config/config");
const User = require("./User");

// Sync all defined models to the database
async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to sync tables:", error);
    };
};

module.exports = syncDatabase;