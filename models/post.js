"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Account);
    }

    // Static method untuk mendapatkan semua post berdasarkan sort
    static getAllPosts(sort) {
      return Post.findAll({
        include: {
          model: sequelize.models.Account,
          attributes: {
            exclude: ["password"],
          },
          include: {
            model: sequelize.models.User,
          },
        },
        order: [["createdAt", sort]],
      });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      AccountId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
