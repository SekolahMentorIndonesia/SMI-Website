const axios = require('axios');

async function testEnrollment() {
  console.log('Testing enrollment functionality...\n');
  
  // First, login to get a token
  let token;
  try {
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'dzarelalghifari123@gmail.com',
      password: 'dzarel123'
    });
    
    if (loginResponse.status === 200) {
      token = loginResponse.data.token;
      console.log('✅ Login successful, got token.');
    }
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return;
  }
  
  // Test enrollment submission with correct endpoint
  try {
    // Test with valid data first
    console.log('\n🔹 Testing enrollment with valid data...');
    const enrollmentResponse = await axios.post('http://localhost:5000/api/user/enrollment', {
      package_id: 1,
      name: 'User Biasa',
      email: 'dzarelalghifari123@gmail.com',
      telegram_user: '@testuser',
      phone_number: '08123456789',
      motivation: 'I want to learn from the best!',
      payment_method: 'rekening',
      proof_description: 'Transfer from BCA',
      payment_amount: '500000'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (enrollmentResponse.status === 201) {
      console.log('✅ Enrollment submission successful!');
      console.log('   Enrollment ID:', enrollmentResponse.data.enrollment.id);
      console.log('   Payment ID:', enrollmentResponse.data.payment.id);
    }
  } catch (error) {
    console.error('❌ Enrollment submission failed:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('   Errors:', error.response.data.errors);
    }
  }
  
  // Test with invalid email to see if our fix works
  try {
    console.log('\n🔹 Testing enrollment with invalid email (should be handled gracefully)...');
    const enrollmentResponse = await axios.post('http://localhost:5000/api/user/enrollment', {
      package_id: 1,
      name: 'Test User',
      email: 'invalid-email-format', // Invalid email to test our validation
      telegram_user: '@testuser',
      phone_number: '08123456789',
      motivation: 'Test motivation',
      payment_method: 'rekening',
      proof_description: 'Test payment',
      payment_amount: '500000'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (enrollmentResponse.status === 201) {
      console.log('✅ Enrollment submission successful even with invalid email (fix working)!');
      console.log('   Enrollment ID:', enrollmentResponse.data.enrollment.id);
      console.log('   Payment ID:', enrollmentResponse.data.payment.id);
    }
  } catch (error) {
    console.error('❌ Enrollment submission failed with invalid email:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('   Errors:', error.response.data.errors);
    }
  }
}

// Run the test
testEnrollment();
