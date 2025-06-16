"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Rating extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "reviewerId", as: "reviewer" });
      this.belongsTo(models.User, { foreignKey: "revieweeId", as: "reviewee" });
    }
  }
  Rating.init(
    {
      reviewerId: { type: DataTypes.INTEGER, allowNull: false },
      revieweeId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.FLOAT, allowNull: false },
      comment: DataTypes.TEXT,
    },
    { sequelize, modelName: "Rating" }
  );
  return Rating;
};
