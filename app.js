const express = require("express");
const authRoutes = require("./routes/authRoutes");
const app = express();
const morgan = require("morgan");
const syncDatabase = require("./models/index");
const port = 3000;

app.use(express.json());

// Synch the database
syncDatabase();

// Use morgan to log requests to the console
app.use(morgan('combined'));

app.use("/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});