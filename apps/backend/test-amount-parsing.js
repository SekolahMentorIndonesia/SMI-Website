const sequelize = require('./src/config/database');
const { User, MentorPackage, Enrollment, Payment } = require('./src/models');

async function testAmountParsing() {
    try {
        console.log('🔄 Testing amount parsing...');
        
        // Sync database
        await sequelize.sync({ force: false });
        console.log('✅ Database synced');
        
        // Get test user and package
        const user = await User.findOne({ where: { email: 'dzarel@gmail.com' } });
        const pkg = await MentorPackage.findOne();
        
        if (!user || !pkg) {
            console.error('❌ Missing test data');
            return;
        }
        
        // Test cases with different currency formats
        const testCases = [
            'Rp50.000',     // Frontend format
            'Rp 100.000',   // With space
            '150.000',      // Without currency symbol
            'Rp500000',     // Without thousand separator
            'Rp1.200.000',  // Million with thousand separators
            pkg.price       // Original price from package
        ];
        
        for (const amountStr of testCases) {
            console.log(`\n📌 Testing with amount: "${amountStr}"`);
            
            // Parse amount using the correct logic for Indonesian currency
            const parseAmount = (amountStr) => {
                if (!amountStr) return pkg.price;
                // Remove currency symbols, then replace thousand separators (dots) with empty string
                const cleanAmount = amountStr
                    .replace(/[Rp\s]/g, '')  // Remove currency symbol and spaces
                    .replace(/\./g, '')      // Remove thousand separators (dots)
                    .replace(/,/g, '.');     // Replace decimal commas with dots (if any)
                return parseFloat(cleanAmount);
            };
            
            const parsedAmount = parseAmount(amountStr);
            console.log(`   Parsed to: ${parsedAmount}`);
            
            // Create enrollment
            const enrollment = await Enrollment.create({
                user_id: user.id,
                package_id: pkg.id,
                status: 'WAITING_APPROVAL',
                motivation: `Test with amount: ${amountStr}`
            });
            
            // Test creating payment with parsed amount
            try {
                const payment = await Payment.create({
                    enrollment_id: enrollment.id,
                    amount: parsedAmount,
                    proof_image: 'uploads/test.jpg',
                    status: 'PENDING'
                });
                console.log(`   ✅ Payment created successfully: #${payment.id}`);
                
                // Verify the amount was stored correctly
                const savedPayment = await Payment.findByPk(payment.id);
                console.log(`   📋 Saved amount: ${savedPayment.amount}`);
                
                // Clean up
                await payment.destroy();
                await enrollment.destroy();
                
            } catch (paymentError) {
                console.error(`   ❌ Payment creation failed:`, paymentError.message);
                await enrollment.destroy();
            }
        }
        
        console.log('\n🎉 All amount parsing tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('❌ Stack trace:', error.stack);
    } finally {
        await sequelize.close();
    }
}

testAmountParsing();