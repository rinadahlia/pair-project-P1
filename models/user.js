"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Account);
    }

    // Getter untuk mendapatkan dateOfBirth dalam format ISO (YYYY-MM-DD)
    get ISODate() {
      const dateObj = new Date(this.dateOfBirth);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You you must fill the First Name!",
          },
          notEmpty: {
            msg: "You you must fill the First Name!",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You you must fill the Last Name!",
          },
          notEmpty: {
            msg: "You you must fill the Last Name!",
          },
        },
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You you must fill the Date of birth!",
          },
          notEmpty: {
            msg: "You you must fill the Date of birth!",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You you must fill the address!",
          },
          notEmpty: {
            msg: "You you must fill the address!",
          },
        },
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "You you must fill the bio!",
          },
          notEmpty: {
            msg: "You you must fill the bio!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
