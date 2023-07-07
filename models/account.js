"use strict";
const bcrypt = require("bcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasOne(models.User);
      Account.hasMany(models.Post);
    }
  }
  Account.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You have to fill the Username!",
          },
          notEmpty: {
            msg: "You have to fill the Username!",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You have to fill the E-mail!",
          },
          notEmpty: {
            msg: "You have to fill the E-mail!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You have to fill the Password!",
          },
          notEmpty: {
            msg: "You have to fill the Password!",
          },
          len: {
            args: [8, 13],
            msg: "Length password is between 8 - 12 characters!",
          },
        },
      },
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Account",
      hooks: {
        beforeCreate(account, opt) {
          if (account.password) {
            const hashedPassword = bcrypt.hashSync(account.password, 10);
            account.password = hashedPassword;
          }
        },
      },
    }
  );
  return Account;
};
