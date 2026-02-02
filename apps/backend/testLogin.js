const axios = require('axios');

// Test login with the newly created users
const testUsers = [
  { email: 'superadmin@smi.id', password: 'passwordsuperadmin', expectedRole: 'superadmin' },
  { email: 'admin@smi.id', password: 'passwordadmin', expectedRole: 'admin' },
  { email: 'dzarelalghifari123@gmail.com', password: 'dzarel123', expectedRole: 'user' }
];

async function testLogin() {
  console.log('Testing login functionality...\n');
  
  for (const testUser of testUsers) {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: testUser.email,
        password: testUser.password
      });
      
      if (response.status === 200) {
        const { user, token } = response.data;
        console.log(`✅ Login successful for ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Token generated: ${token.substring(0, 20)}...`);
        console.log(`   Status: ${user.status}`);
      }
    } catch (error) {
      console.log(`❌ Login failed for ${testUser.email}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }
    console.log('');
  }
}

// Run the test
testLogin();
