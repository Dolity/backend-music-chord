"use strict"
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn("Users", "permission", {
      type: Sequelize.STRING,
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "role")
    await queryInterface.removeColumn("Users", "permission")
  },
}
