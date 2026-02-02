// Script to create test users in JSON file (temporary solution)
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Test users from README
const testUsers = [
  {
    id: 1,
    name: 'Superadmin',
    email: 'superadmin@smi.id',
    password: 'passwordsuperadmin',
    role: 'superadmin',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Admin Operasional',
    email: 'admin@smi.id',
    password: 'passwordadmin',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'User Biasa',
    email: 'dzarelalghifari123@gmail.com',
    password: 'dzarel123',
    role: 'user',
    status: 'active',
    created_at: new Date().toISOString()
  }
];

// Hash passwords
async function hashPasswords() {
  for (let user of testUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password_hash = hashedPassword;
    console.log(`✅ User created: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}`);
    console.log(`   Password: ${user.password} (plain)`);
    console.log(`   Hash: ${hashedPassword.substring(0, 50)}...`);
    console.log('---');
  }
  
  // Save to JSON file
  const filePath = path.join(__dirname, 'test-users.json');
  fs.writeFileSync(filePath, JSON.stringify(testUsers, null, 2));
  console.log(`📁 Test users saved to: ${filePath}`);
  
  return testUsers;
}

hashPasswords().then(() => {
  console.log('✅ All test users created successfully!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error creating users:', error);
  process.exit(1);
});
