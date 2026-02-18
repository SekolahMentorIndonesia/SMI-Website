const { User } = require('./src/models');

async function testAuth() {
  try {
    console.log('=== TESTING AUTHENTICATION ===\n');

    // 1. List all existing users
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'status']
    });
    console.log('Existing users:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.status}`);
    });
    console.log('');

    // 2. Test password verification for admin
    const admin = await User.findOne({ where: { email: 'admin@smi.multipriority.com' } });
    if (admin) {
      const isAdminValid = await admin.comparePassword('passwordadmin');
      console.log(`Admin password (passwordadmin) valid: ${isAdminValid}`);
    }

    // 3. Test password verification for superadmin
    const superadmin = await User.findOne({ where: { email: 'superadmin@smi.multipriority.com' } });
    if (superadmin) {
      const isSuperadminValid = await superadmin.comparePassword('passwordsuperadmin');
      console.log(`Superadmin password (passwordsuperadmin) valid: ${isSuperadminValid}`);
    }

    // 4. Create a test user
    const testUserEmail = 'testuser@example.com';
    const existingTestUser = await User.findOne({ where: { email: testUserEmail } });
    
    if (!existingTestUser) {
      const testUser = await User.create({
        name: 'Test User',
        email: testUserEmail,
        password: 'testpassword123',
        role: 'user',
        status: 'approved'
      });
      console.log(`\nTest user created: ${testUserEmail} / testpassword123`);
    } else {
      console.log(`\nTest user already exists: ${testUserEmail}`);
      const isTestUserValid = await existingTestUser.comparePassword('testpassword123');
      console.log(`Test user password (testpassword123) valid: ${isTestUserValid}`);
    }

    console.log('\n=== AUTHENTICATION TEST COMPLETED ===');

  } catch (error) {
    console.error('Error during auth test:', error.message);
  } finally {
    process.exit();
  }
}

testAuth();