const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.sendStatus(403);

    // Check if the userId exists in the database
    const userId = jwt.decode(token, { complete: true })?.payload?.id;
    if (!userId) return res.sendStatus(403);

    const user = await User.findByPk(userId);
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;