const User = require("../models/User");
const errorHandler = require("../middleware/errorHandler");

// Get user info
const getUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out sensitive information
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tokens: user.tokens,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    res.status(200).json(userData);
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = { getUser };
