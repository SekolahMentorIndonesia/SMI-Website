// Script to register a new user into the database
const User = require('./src/models/User');

async function registerUser() {
  try {
    // Create a new user
    const newUser = await User.create({
      name: 'Dzarel Alghifari', // Default name derived from email
      email: 'dzarelalghifari123@gmail.com',
      password: 'dzarel123',
      role: 'user', // Default role
      status: 'pending' // Default status
    });

    console.log('User registered successfully!');
    console.log('User details:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.created_at
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
  } finally {
    // Close database connection
    process.exit();
  }
}

registerUser();
