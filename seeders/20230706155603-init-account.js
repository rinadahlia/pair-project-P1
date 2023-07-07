'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Accounts', [{
      username: 'JohnDoe',
      email: 'jhon@mail.com',
      password: '123',
      role: 'User',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Accounts', null, {});
  }
};
