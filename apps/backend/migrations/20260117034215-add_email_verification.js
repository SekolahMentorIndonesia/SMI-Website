'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add email_verified column if it doesn't exist
    await queryInterface.addColumn('Users', 'email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Set all existing users' email_verified to true (assuming they were verified before this migration)
    await queryInterface.sequelize.query(
      'UPDATE "Users" SET email_verified = true WHERE email_verified IS NULL;'
    );

    // Make sure phone_number is not null and unique
    await queryInterface.changeColumn('Users', 'phone_number', {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    });

    // Make sure email is not null and unique
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove email_verified column
    await queryInterface.removeColumn('Users', 'email_verified');
    
    // Revert phone_number changes if needed
    await queryInterface.changeColumn('Users', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
  }
};
