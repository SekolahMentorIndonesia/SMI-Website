// Debug enrollment notification - cek kenapa tidak masuk Telegram
const { Enrollment, Payment, User, MentorPackage } = require('./src/models');
const telegramService = require('./src/services/telegram.service');

async function debugEnrollment() {
    console.log('🔍 DEBUG ENROLLMENT NOTIFICATION');
    console.log('=================================');
    
    try {
        // 1. Cari enrollment pending terbaru
        console.log('\n📋 Mencari enrollment pending...');
        const pendingEnrollment = await Enrollment.findOne({
            where: { status: 'pending' },
            include: [
                { model: User },
                { model: MentorPackage },
                { model: Payment }
            ],
            order: [['created_at', 'DESC']]
        });
        
        if (!pendingEnrollment) {
            console.log('❌ Tidak ada enrollment pending');
            return;
        }
        
        console.log('✅ Found pending enrollment:');
        console.log(`   Request ID: ${pendingEnrollment.request_id}`);
        console.log(`   User: ${pendingEnrollment.User.name} (${pendingEnrollment.User.email})`);
        console.log(`   Phone: ${pendingEnrollment.User.phone_number}`);
        console.log(`   Package: ${pendingEnrollment.MentorPackage.name}`);
        console.log(`   Amount: ${pendingEnrollment.Payment?.amount}`);
        
        // 2. Test manual Telegram notification
        console.log('\n📤 Testing manual Telegram notification...');
        
        const caption = `🧪 DEBUG TEST - MANUAL TRIGGER\n\n` +
            `📋 Request ID: ${pendingEnrollment.request_id}\n` +
            `👤 User: ${pendingEnrollment.User.name} (${pendingEnrollment.User.email})\n` +
            `📱 Telegram: ${pendingEnrollment.User.telegram_user || 'Belum ditambahkan'}\n` +
            `📞 Telepon: ${pendingEnrollment.User.phone_number || 'Belum ditambahkan'}\n` +
            `📦 Paket: ${pendingEnrollment.MentorPackage.name}\n` +
            `💰 Harga Paket: ${pendingEnrollment.MentorPackage.price}\n` +
            `💵 Jumlah Bayar: ${pendingEnrollment.Payment?.amount}\n` +
            `💳 Metode Bayar: Transfer Bank\n\n` +
            `💬 Deskripsi: Debug test\n` +
            `📝 Motivasi: Debug notification\n\n` +
            `Status: PENDING - Menunggu Verifikasi\n\n` +
            `Untuk verifikasi:\n` +
            `/terima ${pendingEnrollment.request_id} atau /tolak ${pendingEnrollment.request_id} [ALASAN]`;
        
        console.log('🔍 Sending message...');
        try {
            const messageResult = await telegramService.sendMessage(caption);
            console.log('✅ Message sent result:', messageResult.ok);
            console.log('✅ Message ID:', messageResult.result?.message_id);
        } catch (msgError) {
            console.error('❌ Message error:', msgError.message);
            if (msgError.response) {
                console.error('❌ Response status:', msgError.response.status);
                console.error('❌ Response data:', msgError.response.data);
            }
        }
        
        // 3. Test photo notification (jika ada)
        if (pendingEnrollment.Payment?.proof_image) {
            console.log('\n📷 Testing photo notification...');
            console.log(`📁 Photo path: ${pendingEnrollment.Payment.proof_image}`);
            
            try {
                const photoResult = await telegramService.sendPhoto(pendingEnrollment.Payment.proof_image, caption);
                console.log('✅ Photo sent result:', photoResult.ok);
                console.log('✅ Photo message ID:', photoResult.result?.message_id);
            } catch (photoError) {
                console.error('❌ Photo error:', photoError.message);
                if (photoError.response) {
                    console.error('❌ Photo response status:', photoError.response.status);
                    console.error('❌ Photo response data:', photoError.response.data);
                }
            }
        }
        
        // 4. Test command parsing
        console.log('\n🤖 Testing command parsing...');
        const shortId = pendingEnrollment.request_id.split('-').pop();
        console.log(`📋 Short ID: ${shortId}`);
        console.log(`📋 Full command: /terima${shortId}`);
        console.log(`📋 Reject command: /tolak${shortId} alasan testing`);
        
        // 5. Cek Telegram config
        console.log('\n⚙️  Checking Telegram config...');
        console.log('🔑 Bot Token configured:', telegramService.isConfigured);
        console.log('💬 Chat ID:', telegramService.chatId);
        console.log('🌐 Base URL:', telegramService.baseUrl);
        
        console.log('\n🎉 DEBUG COMPLETE');
        console.log('📱 Check Telegram for debug messages');
        
    } catch (error) {
        console.error('❌ DEBUG ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
}

debugEnrollment();
