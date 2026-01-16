const { User } = require('./src/models');
const sequelize = require('./src/config/database');

async function listUsers() {
  try {
    const users = await User.findAll();
    console.log('Total users:', users.length);
    users.forEach(u => {
      console.log(`- ${u.email} (${u.role}) status: ${u.status}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listUsers();
