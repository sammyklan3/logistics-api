"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Document extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Document.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      type: DataTypes.STRING,
      url: DataTypes.STRING,
    },
    { sequelize, modelName: "Document" }
  );
  return Document;
};
