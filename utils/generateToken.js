// Function to generate JWT tokens
const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({
        id: user.id,
        username: user.name,
        userId: user.userId,
        role: user.role
    }, secret, { expiresIn });
};

module.exports = generateToken;