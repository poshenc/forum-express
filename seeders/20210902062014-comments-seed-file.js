'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }).map((d, i) =>
      ({
        text: faker.lorem.sentence(),
        //UserId: Math.floor(Math.random() * 3) + 1, //for local db
        //RestaurantId: Math.floor(Math.random() * 50) + 1, //for local db
        UserId: Math.floor(Math.random() * 3) * 10 + 5, //for heroku db
        RestaurantId: Math.floor(Math.random() * 50) * 10 + 5, //for heroku db
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
