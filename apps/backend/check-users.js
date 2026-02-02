// Script to check all users and their statuses
const User = require('./src/models/User');

async function checkUsers() {
  try {
    // Get all users
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    console.log('List of all users:');
    console.log('----------------------------------------');
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Status: ${user.status}`);
      console.log(`Created At: ${user.created_at}`);
      console.log('----------------------------------------');
    });
  } catch (error) {
    console.error('Error checking users:', error.message);
  } finally {
    // Close database connection
    process.exit();
  }
}

checkUsers();
