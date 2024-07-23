const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/config");
const validateEmail = require("../utils/emailValidator");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Shipper = require("../models/Shipper");

const register = async (req, res) => {
    // Get the formdata from the request body
    const { firstName, lastName, username, email, password, role, phoneNumber, companyName } = req.body;

    // Check if all fields are filled
    if (!firstName || !lastName || !username || !email || !password || !role || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required" });
    };

    // Validate the email address
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    };

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if the user exists in the database using email or username
        const existingUser = await User.findOne({
            where: {
                [db.Sequelize.Op.or]: [{ email }, { username }],
            },
        });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        };

        // Create a new user in the database with the hashed password
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role,
            phoneNumber
        });

        // If the companyName field is not empty, then check if it already exists in the database, shipper table
        if (companyName) {
            const existingShipper = await Shipper.findOne({ where: { companyName } });
            if (existingShipper) {
                return res.status(409).json({ message: "Company name already exists" });
            }
        };

        // Add the user to either Driver or Shipper tables based on the role ("shipper" or "trucker")
        if (role === "shipper") {
            await Shipper.create({ 
                userId: user.id,
                companyName
            });
        } else if (role === "trucker") {
            await Driver.create({ userId: user.id });
        }

        // Prepare the user object without returning sensitive data
        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber
        }

        // generate access and refresh tokens
        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "User registered successfully", userData, accessToken, refreshToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid password" });

        // Prepare the user object without returning sensitive data
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber
        };

        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        res.json({ accessToken, refreshToken, userData });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401);

    jwt.verify({ token: token }, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.json({ accessToken });
    });
};

module.exports = { register, login, refreshToken };