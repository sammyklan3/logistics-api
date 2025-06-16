const {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  deleteProfile,
} = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await deleteProfile(req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
module.exports = { register, login, getUser, update, deleteUser };
