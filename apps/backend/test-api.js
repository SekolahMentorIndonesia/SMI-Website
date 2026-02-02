// Test script to call /api/user/me endpoint manually
const axios = require('axios');

async function testUserMeEndpoint() {
    console.log('Testing /api/user/me endpoint...');
    
    try {
        // First, login to get token
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'dzarelalghifari123@gmail.com',
            password: 'dzarel123'
        });
        
        console.log('Login successful!');
        console.log('Token:', loginResponse.data.token);
        
        // Call /api/user/me endpoint with token
        const userResponse = await axios.get('http://localhost:5000/api/user/me', {
            headers: {
                Authorization: `Bearer ${loginResponse.data.token}`
            }
        });
        
        console.log('\nUser Me Response:');
        console.log(JSON.stringify(userResponse.data, null, 2));
        
    } catch (error) {
        console.error('Error testing API:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testUserMeEndpoint();
