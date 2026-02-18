// Test sederhana enrollment tanpa file upload
const axios = require('axios');

async function testSimpleEnrollment() {
    console.log('🧪 TEST SIMPLE ENROLLMENT');
    console.log('==========================');
    
    try {
        const baseURL = 'http://localhost:5000/api';
        
        // 1. Login dengan existing superadmin (sudah verified)
        console.log('\n🔐 Login dengan existing user...');
        
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'superadmin@smi.multipriority.com',
            password: 'password123' // asumsi password
        });
        
        const userToken = loginResponse.data.token;
        console.log('✅ Login successful');
        console.log('🔑 Token received:', userToken ? 'YES' : 'NO');
        
        // 3. Get packages
        console.log('\n📦 Getting packages...');
        const packagesResponse = await axios.get(`${baseURL}/user/packages`);
        const packages = packagesResponse.data;
        
        if (packages.length === 0) {
            console.log('❌ No packages found');
            return;
        }
        
        const selectedPackage = packages[0];
        console.log(`✅ Selected package: ${selectedPackage.name} (ID: ${selectedPackage.id})`);
        
        // 4. Test enrollment TANPA file (proof_image null)
        console.log('\n💳 Testing enrollment WITHOUT file...');
        
        // Get user data untuk enrollment
        const userResponse = await axios.get(`${baseURL}/user/me`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        
        const userData = userResponse.data;
        console.log('👤 User data:', { name: userData.name, email: userData.email, phone: userData.phone_number });
        
        const enrollmentData = {
            package_id: selectedPackage.id,
            name: userData.name,
            email: userData.email,
            phone_number: userData.phone_number,
            motivation: 'Test simple enrollment tanpa file',
            payment_method: 'rekening',
            proof_description: 'Test description',
            payment_amount: selectedPackage.price.toString()
        };
        
        try {
            const enrollmentResponse = await axios.post(
                `${baseURL}/user/enrollment`, 
                enrollmentData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('✅ Enrollment submitted!');
            console.log('📋 Request ID:', enrollmentResponse.data.enrollment.request_id);
            console.log('📊 Status:', enrollmentResponse.data.enrollment.status);
            
            // 5. Check database
            console.log('\n🔍 Checking database logs...');
            console.log('✅ Check backend console for DEBUG logs');
            console.log('✅ Check Telegram for notification');
            console.log('✅ Check admin dashboard');
            
        } catch (enrollmentError) {
            console.error('❌ Enrollment failed:');
            if (enrollmentError.response) {
                console.error('Status:', enrollmentError.response.status);
                console.error('Data:', enrollmentError.response.data);
            } else {
                console.error('Message:', enrollmentError.message);
            }
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend server not running');
        }
    }
}

testSimpleEnrollment();
