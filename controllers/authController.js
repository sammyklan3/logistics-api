const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const validateEmail = require("../utils/emailValidator");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Shipper = require("../models/Shipper");
const generateRandomString = require("../utils/randomStringGenerator");
const sendMail = require("../services/mailService");

// Register a new user
const register = async (req, res) => {
    const { firstName, lastName, username, email, password, role, phoneNumber, companyName, licenseNumber } = req.body;

    // Validate required fields
    const requiredFields = [firstName, lastName, username, email, password, role, phoneNumber];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate role-specific fields
    if (role === "trucker" && !licenseNumber) {
        return res.status(400).json({ message: "License number is required for truckers" });
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ email }, { username }]
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
            firstName,
            lastName,
            userId: generateRandomString(),
            username,
            email,
            password: hashedPassword,
            role,
            phoneNumber
        }, { transaction });

        // Check for existing company name if provided
        if (companyName) {
            const existingShipper = await Shipper.findOne({ where: { companyName }, transaction });
            if (existingShipper) {
                await transaction.rollback();
                return res.status(409).json({ message: "Company name already exists" });
            }
        }

        // Add user to role-specific table
        if (role === "shipper") {
            await Shipper.create({
                userId: user.userId,
                UserId: user.id,
                companyName
            }, { transaction });
        } else if (role === "trucker") {
            await Driver.create({
                userId: user.userId,
                UserId: user.id,
                licenseNumber
            }, { transaction });
        } else {
            await transaction.rollback();
            return res.status(400).json({ message: "Invalid role" });
        }

        // Commit the transaction
        await transaction.commit();

        // Prepare user data without sensitive information
        const userData = {
            id: user.id,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber
        }

        // Generate tokens
        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Send welcome email
        sendMail(
            user.email,
            "Welcome to NovaCore",
            `Hello ${user.username}, welcome to the platform`,
            `<p>Hello <b>${user.firstName} ${user.lastName}</b>,</p><p>Welcome to our service! </p> <br>${role === "shipper" ? "You've registered as a shipper" : "You've registered as a driver"}`
        );

        // Respond with user data and tokens
        res.status(201).json({ message: "User registered successfully", userData, accessToken, refreshToken });

    } catch (err) {
        // Rollback the transaction in case of error
        if (transaction) await transaction.rollback();
        res.status(500).json({ error: err.message });
    }
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
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        // const location = await getLocation(ip);

        // Send email to notify user of new login
        sendMail(user.email, "New Login", `Hello ${user.username}, a new login was detected on your account`, `<p>Hello <b>${user.firstName} ${user.lastName}</b>,</p><p>A new login was detected on your account</p>`);

        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        res.json({ accessToken, refreshToken, userData });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401);

    jwt.verify({ token: token }, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.json({ accessToken });
    });
};

// Delete a user
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
        const user = await User.findOne({ where: { userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete any photo files associated with this user
        // deletePhotoFiles(user.photo);


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
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {

        // Check if user already exists
        const user = await User.findOne({ where: { userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if the user uploaded an image
        if (req.file) {
            // Check if the profilePicture field has a value and delete it
            if (user.profilePicture) {
                // Check if the file exists in the upload folder10 points
                if (fs.existsSync(`../uploads/${user.profilePicture}`)) {
                    // Delete the existing file
                    fs.unlinkSync(`../uploads/${user.profilePicture}`);
                }
            };

            // Update the profile picture field in the database
            user.profilePicture = req.file.filename;
            await user.save();
        };

        // Update the user's other fields

        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login, refreshToken, deleteUser, updateUserProfile };