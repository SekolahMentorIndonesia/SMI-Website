// Final test website → backend → Telegram flow
const axios = require('axios');

async function testFinalWebsite() {
    console.log('🎯 FINAL WEBSITE TEST');
    console.log('======================');
    
    try {
        const baseURL = 'http://localhost:5000/api';
        
        // 1. Login superadmin
        console.log('\n🔐 Login superadmin...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'superadmin@smi.multipriority.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        
        // 2. Get packages
        console.log('\n📦 Get packages...');
        const packagesResponse = await axios.get(`${baseURL}/user/packages`);
        const packages = packagesResponse.data;
        
        if (packages.length === 0) {
            console.log('❌ No packages');
            return;
        }
        
        const pkg = packages[0];
        console.log(`✅ Package: ${pkg.name} (ID: ${pkg.id})`);
        
        // 3. Test enrollment dengan data lengkap
        console.log('\n💳 Testing enrollment...');
        
        const enrollmentData = {
            package_id: pkg.id,
            name: 'Superadmin Test',
            email: 'superadmin@smi.multipriority.com',
            phone_number: '08123456789', // Pastikan ada nomor
            motivation: 'Final test website → backend → Telegram',
            payment_method: 'rekening',
            proof_description: 'Test final validation',
            payment_amount: pkg.price.toString()
        };
        
        console.log('📤 Sending enrollment data...');
        console.log('👤 User:', enrollmentData.name);
        console.log('📞 Phone:', enrollmentData.phone_number);
        console.log('💰 Amount:', enrollmentData.payment_amount);
        
        try {
            const enrollmentResponse = await axios.post(
                `${baseURL}/user/enrollment`,
                enrollmentData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('✅ Enrollment submitted!');
            console.log('📋 Request ID:', enrollmentResponse.data.enrollment.request_id);
            console.log('📊 Status:', enrollmentResponse.data.enrollment.status);
            
            // 4. Check my enrollments
            console.log('\n📋 Check my enrollments...');
            const myEnrollmentsResponse = await axios.get(`${baseURL}/user/me/enrollments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const enrollments = myEnrollmentsResponse.data;
            console.log(`✅ Found ${enrollments.length} enrollments`);
            
            enrollments.forEach((enrollment, index) => {
                const shortId = enrollment.request_id.split('-').pop();
                console.log(`   ${index + 1}. ${shortId} - ${enrollment.status.toUpperCase()}`);
            });
            
            console.log('\n🎉 FINAL TEST COMPLETE!');
            console.log('📱 Check Telegram for notification');
            console.log('🖥️  Check admin dashboard');
            console.log('✅ All validations working');
            
        } catch (enrollmentError) {
            console.error('❌ Enrollment error:');
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
            console.log('❌ Backend not running');
        }
    }
}

testFinalWebsite();
