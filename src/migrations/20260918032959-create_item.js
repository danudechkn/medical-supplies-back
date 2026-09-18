'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      itemname: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      active: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue: "Y",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('NOW'),
      },
      created_by: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      updated_by: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      inv_code: {
        type: Sequelize.STRING(15),
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item');
  }
};
