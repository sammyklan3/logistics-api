const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const validateEmail = require("../utils/emailValidator");
const User = require("../models/User");
const createDriverProfile = require("../utils/createDriverProfile");
const createShipperProfile = require("../utils/createShipperProfile");
const createCompanyProfile = require("../utils/createCompanyProfile");
const generateToken = require("../utils/generateToken");
const sendMail = require("../services/mailService");
const deleteFile = require("../utils/deleteFile");

// Create an enum for user roles
const roles = {
    shipper: "shipper",
    driver: "driver",
    company: "company"
};

// Register a new user
const register = async (req, res) => {
    const {
        name, email, password, role, phoneNumber,
        licenseNumber, vehicleType, vehicleCapacity,
        experienceYears, companyName, fleetSize
    } = req.body;

    // Validate required fields
    const requiredFields = [name, email, password, role, phoneNumber];

    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ email }, { phone_number: phoneNumber }]
            },
            transaction
        });

        if (existingUser) {
            await transaction.rollback();
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone_number: phoneNumber,
        }, { transaction });

        // Role-specific profile creation
        await createProfileBasedOnRole(role, user.id, {
            licenseNumber, vehicleType, vehicleCapacity,
            experienceYears, companyName, fleetSize, transaction
        });

        // Commit the transaction
        await transaction.commit();

        // Prepare user data without sensitive information
        const userData = {
            id: user.id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phone_number,
        };

        // Generate tokens
        const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "15m");
        const refreshToken = generateToken(user, process.env.REFRESH_TOKEN_SECRET, "7d");

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name, role);

        // Respond with user data and tokens
        res.status(201).json({ message: "User registered successfully", userData, accessToken, refreshToken });

    } catch (err) {
        // Rollback the transaction only if it's still active
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        res.status(500).json({ error: err.message });
    }
};

// Helper function to create role-specific profiles
const createProfileBasedOnRole = async (role, userId, profileData) => {
    const { licenseNumber, vehicleType, vehicleCapacity, experienceYears, companyName, fleetSize, transaction } = profileData;

    if (role === roles.driver) {
        await createDriverProfile(userId, { licenseNumber, vehicleType, vehicleCapacity, experienceYears, transaction });
    } else if (role === roles.shipper) {
        await createShipperProfile(userId, companyName, transaction);
    } else if (role === roles.company) {
        await createCompanyProfile(userId, companyName, fleetSize, transaction);
    } else {
        await transaction.rollback();
        throw new Error("Invalid user role");
    }
};

// Function to send a welcome email
const sendWelcomeEmail = async (email, name, role) => {
    const subject = "Welcome to NovaCore";
    const message = `Hello ${name}, welcome to the platform`;
    const htmlMessage = `<p>Hello <b>${name}</b>,</p><p>Welcome to our service!</p><br>${role === "shipper" ? "You've registered as a shipper" : "You've registered as a driver"}`;

    await sendMail(email, subject, message, htmlMessage);
};


// Login a user
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
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber
        };

        // Get location of login
        // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        // const location = await getLocation(ip);

        // Send email to notify user of new login
        sendMail(user.email, "New Login", `Hello ${user.username}, a new login was detected on your account`, `<p>Hello <b>${user.firstName} ${user.lastName}</b>,</p><p>A new login was detected on your account</p>`);

        // Generate tokens
        const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "15m");
        const refreshToken = generateToken(user, process.env.REFRESH_TOKEN_SECRET, "7d");

        res.json({ accessToken, refreshToken, userData });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401);

    jwt.verify({ token: token }, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        // Generate a new access token
        const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "15m");
        res.json({ accessToken });
    });
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "User ID is required" });

    try {
        const user = await User.findOne({ where: { id } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete any photo files associated with this user
        if (user.profile_picture) {
            // Call a function to delete the file
            deleteFile(user.profile_picture);
        }

        await user.destroy();
        res.status(204).json({ message: "User deleted successfully" });

        // Send an email to the user to notify them of the account deletion
        sendMail(
            user.email,
            "Account Deletion",
            `Hello ${user.username}, your account has been deleted`,
            `<p>Hello <b>${user.firstName} ${user.lastName}</b>,</p><p>Your account has been deleted</p>`
        );

    } catch {
        res.status(400).json({ error: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    // Get user ID from request
    const { id } = req.user;

    if (!id) return res.status(400).json({ message: "User ID is required" });

    try {
        // Check if user already exists
        const user = await User.findOne({ where: { id } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the user uploaded an image
        if (req.file) {
            // Check if the profile_picture field has a value and delete it
            if (user.profile_picture) {
                deleteFile(user.profile_picture);
            };

            // Update the profile picture field in the database
            user.profile_picture = req.file.filename;
            await user.save();
        };

        // Update the user's other fields

        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login, refreshToken, deleteUser, updateUserProfile };