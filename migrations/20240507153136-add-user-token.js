"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "token", {
      type: Sequelize.STRING,
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "token")
  },
}
