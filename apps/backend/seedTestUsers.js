const sequelize = require('./src/config/database');
const User = require('./src/models/User');

async function seedTestUsers() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');
    
    // Test users to create
    const testUsers = [
      { email: 'superadmin@smi.multipriority.com', password: 'passwordsuperadmin', name: 'Superadmin', role: 'superadmin' },
      { email: 'admin@smi.multipriority.com', password: 'passwordadmin', name: 'Admin Operasional', role: 'admin' },
      { email: 'dzarelalghifari123@gmail.com', password: 'dzarel123', name: 'User Biasa', role: 'user' }
    ];
    
    // Check existing users
    const existingUsers = await User.findAll({ attributes: ['email'] });
    const existingEmails = new Set(existingUsers.map(user => user.email));
    
    console.log('\nExisting users:', Array.from(existingEmails).join(', '));
    
    // Create missing users
    for (const userData of testUsers) {
      if (!existingEmails.has(userData.email)) {
        console.log(`\nCreating user: ${userData.email}`);
        await User.create(userData);
        console.log(`✓ User ${userData.email} created successfully.`);
      } else {
        console.log(`\nUser ${userData.email} already exists.`);
      }
    }
    
    console.log('\n✅ All test users have been processed.');
    
    // Verify created users
    const allUsers = await User.findAll({ attributes: ['email', 'role', 'name'] });
    console.log('\nAll users in database:');
    allUsers.forEach(user => {
      console.log(`${user.name} (${user.email}) - ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
seedTestUsers();
