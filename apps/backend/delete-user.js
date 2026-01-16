// Script to delete a user from the database
const User = require('./src/models/User');

async function deleteUser() {
  try {
    // Delete user by email
    const result = await User.destroy({
      where: { email: 'dzarelalghifari123@gmail.com' }
    });

    if (result > 0) {
      console.log('User deleted successfully!');
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
  } finally {
    // Close database connection
    process.exit();
  }
}

deleteUser();
