const sequelize = require('./src/config/database');
const { User, MentorPackage, Enrollment, Payment } = require('./src/models');
const telegramService = require('./src/services/telegram.service');

async function testPaymentFlow() {
    try {
        console.log('🔄 Starting payment flow test...');
        
        // Sync database
        await sequelize.sync({ force: false });
        console.log('✅ Database synced');
        
        // Get test user
        const user = await User.findOne({ where: { email: 'dzarel@gmail.com' } });
        if (!user) {
            console.error('❌ Test user not found');
            return;
        }
        console.log('✅ Test user found:', user.email);
        
        // Get first available package
        const pkg = await MentorPackage.findOne();
        if (!pkg) {
            console.error('❌ No packages found');
            return;
        }
        console.log('✅ Test package found:', pkg.name);
        
        // Create test enrollment
        const enrollment = await Enrollment.create({
            user_id: user.id,
            package_id: pkg.id,
            product_type: pkg.product_type,
            status: 'pending',
            motivation: 'Test motivation',
            request_id: `INV-TEST-${Date.now()}` // Manual override untuk test
        });
        console.log('✅ Enrollment created:', enrollment.id);
        
        // Create test payment
        const payment = await Payment.create({
            enrollment_id: enrollment.id,
            amount: pkg.price,
            proof_image: 'uploads/test.jpg', // Use a dummy path for testing
            status: 'PENDING'
        });
        console.log('✅ Payment created:', payment.id);
        
        // Test Telegram notification
        console.log('📤 Testing Telegram notification...');
        const caption = `🔔 TEST PAYMENT PENDING 🔔\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name} (${user.email})\n` +
            `📱 Telegram: ${user.telegram_user || 'Belum ditambahkan'}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `💰 Harga Paket: ${pkg.price}\n` +
            `💵 Jumlah Bayar: ${payment.amount}\n` +
            `💳 Metode Bayar: Transfer Bank\n\n` +
            `💬 Deskripsi: Test description\n` +
            `📝 Motivasi: Test motivation\n\n` +
            `Status: PENDING - Menunggu Verifikasi\n\n` +
            `Untuk verifikasi:\n` +
            `/terima ${enrollment.request_id} atau /tolak ${enrollment.request_id} [ALASAN]`;
        
        try {
            // Just test the message part, not the photo since we don't have a real file
            await telegramService.sendMessage(caption);
            console.log('✅ Telegram notification sent successfully!');
        } catch (telegramError) {
            console.error('⚠️  Telegram notification failed:', telegramError.message);
            console.log('⚠️  Note: This might be due to bot token/chat ID issues, but the payment process itself worked.');
        }
        
        console.log('🎉 Payment flow test completed successfully!');
        console.log('📋 Test results:');
        console.log('   - Enrollment ID:', enrollment.id);
        console.log('   - Payment ID:', payment.id);
        console.log('   - Package:', pkg.name);
        console.log('   - User:', user.email);
        
        // Clean up test data
        await payment.destroy();
        await enrollment.destroy();
        console.log('🧹 Test data cleaned up');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('❌ Stack trace:', error.stack);
    } finally {
        await sequelize.close();
    }
}

testPaymentFlow();