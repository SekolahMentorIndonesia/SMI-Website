// Test website → backend → Telegram flow
const axios = require('axios');

async function testWebsiteFlow() {
    console.log('🌐 TEST WEBSITE → BACKEND → TELEGRAM');
    console.log('===================================');
    
    try {
        const baseURL = 'http://localhost:5000/api';
        
        // 1. Test register dengan phone_number WAJIB
        console.log('\n📝 Testing register dengan phone_number...');
        
        const registerData = {
            name: 'Test User Website',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            phone_number: `081${Date.now().toString().slice(-8)}`
        };
        
        try {
            const registerResponse = await axios.post(`${baseURL}/auth/register`, registerData);
            console.log('✅ Register successful:', registerResponse.data.message);
            const token = registerResponse.data.token;
            
            // 2. Test login
            console.log('\n🔐 Testing login...');
            const loginResponse = await axios.post(`${baseURL}/auth/login`, {
                email: registerData.email,
                password: registerData.password
            });
            
            console.log('✅ Login successful');
            const userToken = loginResponse.data.token;
            
            // 3. Test get packages
            console.log('\n📦 Getting packages...');
            const packagesResponse = await axios.get(`${baseURL}/user/packages`);
            const packages = packagesResponse.data;
            
            if (packages.length === 0) {
                console.log('❌ No packages found');
                return;
            }
            
            const selectedPackage = packages[0];
            console.log(`✅ Selected package: ${selectedPackage.name}`);
            
            // 4. Test enrollment/payment submission
            console.log('\n💳 Testing enrollment submission...');
            
            const enrollmentData = {
                package_id: selectedPackage.id,
                name: registerData.name,
                email: registerData.email,
                phone_number: registerData.phone_number,
                motivation: 'Test motivation dari website',
                payment_method: 'rekening',
                proof_description: 'Test proof description',
                payment_amount: selectedPackage.price
            };
            
            // Simulate file upload (gunakan dummy path)
            const formData = new FormData();
            Object.keys(enrollmentData).forEach(key => {
                formData.append(key, enrollmentData[key]);
            });
            
            try {
                const enrollmentResponse = await axios.post(
                    `${baseURL}/user/enrollment`, 
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                console.log('✅ Enrollment submitted:', enrollmentResponse.data.message);
                console.log('📋 Enrollment ID:', enrollmentResponse.data.enrollment.request_id);
                
                // 5. Verify database
                console.log('\n🔍 Verifying database...');
                
                // Tunggu sebentar agar proses selesai
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                console.log('✅ Check your Telegram for notification!');
                console.log('✅ Check admin dashboard for new enrollment!');
                
            } catch (enrollmentError) {
                console.error('❌ Enrollment failed:', enrollmentError.response?.data || enrollmentError.message);
            }
            
        } catch (registerError) {
            console.error('❌ Register failed:', registerError.response?.data || registerError.message);
        }
        
        // 6. Test error cases
        console.log('\n🧪 Testing error cases...');
        
        // Test register tanpa phone
        try {
            await axios.post(`${baseURL}/auth/register`, {
                name: 'Test No Phone',
                email: `nophone${Date.now()}@example.com`,
                password: 'password123'
            });
            console.log('❌ Register without phone should fail');
        } catch (error) {
            console.log('✅ Register without phone correctly rejected:', error.response?.data?.message);
        }
        
        // Test register phone sudah ada
        try {
            await axios.post(`${baseURL}/auth/register`, {
                name: 'Test Duplicate Phone',
                email: `duplicate${Date.now()}@example.com`,
                password: 'password123',
                phone_number: registerData.phone_number // Same as above
            });
            console.log('❌ Register with duplicate phone should fail');
        } catch (error) {
            console.log('✅ Register with duplicate phone correctly rejected:', error.response?.data?.message);
        }
        
        console.log('\n🎉 WEBSITE FLOW TEST COMPLETE');
        console.log('📱 Check Telegram for notifications');
        console.log('🖥️  Check admin dashboard for new enrollments');
        
    } catch (error) {
        console.error('❌ FATAL ERROR:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend server not running. Start with: npm start');
        }
    }
}

// Mock FormData untuk testing
global.FormData = class FormData {
    constructor() {
        this.data = {};
    }
    
    append(key, value) {
        this.data[key] = value;
    }
};

testWebsiteFlow();
