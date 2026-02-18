const sequelize = require('./src/config/database');
const { User, MentorPackage } = require('./src/models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Reset DB for seeding
    console.log('Database synced (force: true).');

    // Create Admin
    await User.create({
      name: 'Admin SMI',
      email: 'admin@smi.multipriority.com',
      password: 'passwordadmin',
      role: 'admin',
      status: 'approved'
    });
    console.log('Admin user created: admin@smi.multipriority.com / passwordadmin (Role: admin)');

    // Create Packages
    await MentorPackage.bulkCreate([
      {
        name: 'KOMUNITAS (SILVER)',
        price: 50000,
        description: 'Untuk pemula yang ingin masuk dunia content creator dan belajar bersama komunitas.',
        is_active: true
      },
      {
        name: 'MENTORING (PREMIUM)',
        price: 100000,
        description: 'Sesi mentoring 1-on-1 secara tatap muka dengan mentor profesional.',
        is_active: true
      },
      {
        name: 'PRIVATE EXCLUSIVE (COACHING)',
        price: 5000000,
        description: 'Coaching intensif untuk perusahaan atau institusi.',
        is_active: true
      }
    ]);
    console.log('Initial packages created.');

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
