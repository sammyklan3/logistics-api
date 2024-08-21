const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Token = sequelize.define("Token", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },

    token: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.ENUM("reset", "signin"),
        allowNull: false
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    timestamps: true,
    tableName: "tokens"
});

Token.belongsTo(User, {
    foreignKey: "user_id"
});

User.hasMany(Token, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

module.exports = Token;