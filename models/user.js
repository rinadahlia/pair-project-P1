'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Account)
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You you must fill the First Name!'
        },
        notEmpty: {
          msg: 'You you must fill the First Name!'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You you must fill the Last Name!'
        },
        notEmpty: {
          msg: 'You you must fill the Last Name!'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You you must fill the First Name!'
        },
        notEmpty: {
          msg: 'You you must fill the First Name!'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You you must fill the First Name!'
        },
        notEmpty: {
          msg: 'You you must fill the First Name!'
        }
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'You you must fill the First Name!'
        },
        notEmpty: {
          msg: 'You you must fill the First Name!'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};