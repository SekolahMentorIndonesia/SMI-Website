// Script to register a new admin user into the database
const User = require('./src/models/User');

async function registerAdmin() {
  try {
    // Create a new admin user
    const newAdmin = await User.create({
      name: 'Admin SMI',
      email: 'admin@smi.id',
      password: 'admin123',
      role: 'admin',
      status: 'approved' // Admin status is approved by default
    });

    console.log('Admin user registered successfully!');
    console.log('Admin details:', {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      status: newAdmin.status,
      createdAt: newAdmin.created_at
    });
  } catch (error) {
    console.error('Error registering admin user:', error.message);
  } finally {
    // Close database connection
    process.exit();
  }
}

registerAdmin();
