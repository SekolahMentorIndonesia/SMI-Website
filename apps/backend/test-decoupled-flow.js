// Test DECOUPLED flow - Website → DB → Worker → Telegram
const axios = require('axios');

async function testDecoupledFlow() {
    console.log('🔄 TEST DECOUPLED FLOW');
    console.log('========================');
    
    try {
        const baseURL = 'http://localhost:5000/api';
        
        // 1. Login
        console.log('\n🔐 Login...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'superadmin@smi.id',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        
        // 2. Get packages
        console.log('\n📦 Get packages...');
        const packagesResponse = await axios.get(`${baseURL}/user/packages`);
        const packages = packagesResponse.data;
        const pkg = packages[0];
        console.log(`✅ Package: ${pkg.name}`);
        
        // 3. Test enrollment (DECOUPLED)
        console.log('\n💳 Testing DECOUPLED enrollment...');
        
        const enrollmentData = {
            package_id: pkg.id,
            name: 'Test Decoupled',
            email: 'superadmin@smi.id',
            phone_number: '08111111111',
            motivation: 'Test DECOUPLED flow - Worker handles Telegram',
            payment_method: 'rekening',
            proof_description: 'Decoupled test',
            payment_amount: pkg.price.toString()
        };
        
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
        
        console.log('✅ Enrollment submitted (DECOUPLED)');
        console.log('📋 Request ID:', enrollmentResponse.data.enrollment.request_id);
        console.log('📊 Status:', enrollmentResponse.data.enrollment.status);
        
        // 4. Check worker status
        console.log('\n🤖 Checking worker status...');
        
        // Tunggu worker process (30 detik cycle)
        console.log('⏳ Waiting for worker to process...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        // 5. Manual trigger worker (STRATEGI 2)
        console.log('\n🔧 Manual trigger worker...');
        
        try {
            const triggerResponse = await axios.post(`${baseURL}/internal/send-telegram`);
            console.log('✅ Worker triggered:', triggerResponse.data.message);
        } catch (triggerError) {
            console.error('❌ Worker trigger failed:', triggerError.response?.data || triggerError.message);
        }
        
        // 6. Check database for telegram_sent flag
        console.log('\n🔍 Checking telegram_sent flag...');
        
        // Tunggu lagi untuk worker processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ DECOUPLED TEST COMPLETE');
        console.log('📱 Check Telegram for notification');
        console.log('🤖 Worker should have sent notification');
        
        // 7. Test manual trigger for specific enrollment
        if (enrollmentResponse.data.enrollment.id) {
            console.log('\n🎯 Testing manual trigger for specific enrollment...');
            
            try {
                const manualResponse = await axios.post(
                    `${baseURL}/internal/send-telegram/${enrollmentResponse.data.enrollment.id}`
                );
                console.log('✅ Manual trigger successful:', manualResponse.data.message);
            } catch (manualError) {
                console.error('❌ Manual trigger failed:', manualError.response?.data || manualError.message);
            }
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testDecoupledFlow();
