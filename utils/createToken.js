const User = require("../models/User");
const Token = require("../models/Token");

async function createTokenForUser(userId, tokenData) {
  const user = await User.findByPk(userId);
  if (user) {
    const token = await Token.create({
      ...tokenData,
      user_id: user.id,
    });
    return token;
  }
  throw new Error("User not found");
}

module.exports = createTokenForUser;