// Test full flow: enrollment → payment → telegram
const { Enrollment, MentorPackage, Payment, User } = require('./src/models');
const telegramService = require('./src/services/telegram.service');

async function testFullFlow() {
    console.log('🧪 TEST FULL FLOW WEBSITE → BACKEND → TELEGRAM');
    console.log('==============================================');
    
    try {
        // 1. Cari user yang valid
        const user = await User.findOne({ where: { email: 'superadmin@smi.multipriority.com' } });
        if (!user) {
            console.log('❌ User tidak ditemukan');
            return;
        }
        console.log(`✅ User ditemukan: ${user.name} (${user.email})`);
        
        // 2. Cari package yang available
        const pkg = await MentorPackage.findOne();
        if (!pkg) {
            console.log('❌ Package tidak ditemukan');
            return;
        }
        console.log(`✅ Package ditemukan: ${pkg.name} (${pkg.product_type})`);
        
        // 3. Test enrollment creation
        console.log('\n📝 Membuat enrollment...');
        const enrollment = await Enrollment.create({
            user_id: user.id,
            package_id: pkg.id,
            status: 'pending',
            motivation: 'Test motivation untuk debug',
            product_type: pkg.product_type,
            request_id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        });
        console.log(`✅ Enrollment created: ${enrollment.request_id}`);
        
        // 4. Test payment creation
        console.log('\n💰 Membuat payment...');
        const payment = await Payment.create({
            enrollment_id: enrollment.id,
            amount: pkg.price,
            proof_image: '/tmp/test-proof.jpg', // dummy path
            status: 'PENDING'
        });
        console.log(`✅ Payment created: ID ${payment.id}, Amount: ${payment.amount}`);
        
        // 5. Test Telegram notification
        console.log('\n📤 Mengirim Telegram notification...');
        const caption = `🧪 TEST FULL FLOW - SMI PLATFORM\n\n` +
            `📋 Request ID: ${enrollment.request_id}\n` +
            `👤 User: ${user.name} (${user.email})\n` +
            `📞 Telepon: ${user.phone_number || 'Belum ditambahkan'}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `💰 Harga Paket: ${pkg.price}\n` +
            `💵 Jumlah Bayar: ${payment.amount}\n\n` +
            `Status: PENDING - Menunggu Verifikasi\n\n` +
            `Ini adalah test dari backend untuk debug flow.`;
        
        try {
            // Test send message dulu
            const msgResult = await telegramService.sendMessage(caption);
            console.log('✅ Telegram message sent:', msgResult.ok);
            
            // Test send photo (akan gagal karena file tidak ada, tapi kita lihat errornya)
            try {
                await telegramService.sendPhoto(payment.proof_image, caption);
            } catch (photoError) {
                console.log('⚠️  Photo send failed (expected):', photoError.message);
            }
            
        } catch (telegramError) {
            console.error('❌ Telegram error:', telegramError.message);
        }
        
        // 6. Check database
        console.log('\n🔍 Validasi database...');
        const dbPayment = await Payment.findByPk(payment.id, {
            include: [{ model: Enrollment, include: [User, MentorPackage] }]
        });
        
        if (dbPayment) {
            console.log('✅ Payment ada di database');
            console.log(`   Status: ${dbPayment.status}`);
            console.log(`   Request ID: ${dbPayment.Enrollment.request_id}`);
        } else {
            console.log('❌ Payment tidak ada di database');
        }
        
        console.log('\n🎉 FULL FLOW TEST SELESAI');
        console.log('📱 Cek Telegram Anda untuk notifikasi!');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
}

testFullFlow();
