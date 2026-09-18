'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_data', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      coverage_group: {
        type: Sequelize.STRING(5),
        allowNull: true,
        defaultValue: null,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      reimburse: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      noreimburse: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      stockcode: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: null,
      },
      opd: {
        type: Sequelize.STRING(1),
        allowNull: true,
        defaultValue: "N",
      },
      ipd: {
        type: Sequelize.CHAR(1),
        allowNull: true,
        defaultValue: "N",
      },
      hm: {
        type: Sequelize.CHAR(1),
        allowNull: true,
        defaultValue: "N",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_data');
  }
};
