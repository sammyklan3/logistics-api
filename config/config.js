const { Sequelize } = require("sequelize");
require("dotenv").config();

// Pass connection string conditionally
let connectionString = "";

if (process.env.NODE_ENV !== "production") {
    connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
} else {
    connectionString = process.env.DATABASE_URL;
};

// Passing connection as URI
const sequelize = new Sequelize(connectionString);

// Testing the connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

testConnection();

module.exports = sequelize;