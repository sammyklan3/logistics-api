const bcrypt = require("bcryptjs");
const { User } = require("../models");
const generateToken = require("../utils/util.generateToken");
const { isValidEmail, isValidPassword } = require("../utils/util.validator");

const registerUser = async ({ name, email, password, role }) => {
  const requiredFields = { name, email, password, role };

  for (const key in requiredFields) {
    if (!requiredFields[key]) {
      throw new Error(`${key} is required`);
    }
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  // Validate role if necessary
  const validRoles = ["admin", "shipper", "driver"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Remove password from response
  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  return {
    user: userWithoutPassword,
    token: generateToken(userWithoutPassword),
  };
};

const loginUser = async ({ email, password }) => {
  const requiredFields = { email, password };
  for (const key in requiredFields) {
    if (!requiredFields[key]) {
      throw new Error(`${key} is required`);
    }
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid password");

  return { user, token: generateToken(user) };
};

// Get user info using request token
const getUserById = async (id) => {
  // Check if user exists
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Update profile
const updateProfile = async (id, { name, email, password, phoneNumber }) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (phoneNumber) user.phone = phoneNumber;

  await user.save();
  return user;
};

// Delete profile
const deleteProfile = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }
  await user.destroy();
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  deleteProfile,
};
