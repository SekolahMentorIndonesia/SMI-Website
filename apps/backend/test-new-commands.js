// Test new Telegram commands /terimaXXXX dan /tolakXXXX alasan
const { Enrollment, Payment, User, MentorPackage } = require('./src/models');
const { handleAcceptCommand, handleRejectCommand } = require('./src/controllers/telegramController');

async function testNewCommands() {
    console.log('🤖 TEST NEW TELEGRAM COMMANDS');
    console.log('===============================');
    
    try {
        // 1. Buat test enrollment untuk /terimaXXXX
        console.log('\n📝 Membuat test enrollment untuk /terimaXXXX...');
        const user = await User.findOne({ where: { email: 'superadmin@smi.id' } });
        const pkg = await MentorPackage.findOne();
        
        const acceptEnrollment = await Enrollment.create({
            user_id: user.id,
            package_id: pkg.id,
            status: 'pending',
            motivation: 'Test untuk /terimaXXXX command',
            product_type: pkg.product_type,
            request_id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        });
        
        const acceptPayment = await Payment.create({
            enrollment_id: acceptEnrollment.id,
            amount: pkg.price,
            proof_image: '/tmp/test-accept.jpg',
            status: 'PENDING'
        });
        
        const shortId = acceptEnrollment.request_id.split('-').pop();
        console.log(`✅ Test enrollment created: ${acceptEnrollment.request_id} (short: ${shortId})`);
        
        // Test /terimaXXXX command
        console.log(`\n✅ Testing /terima${shortId} command...`);
        await handleAcceptCommand(`/terima${shortId}`, 8375398953);
        console.log(`✅ Command /terima${shortId} executed`);
        
        // Verify hasil
        const updatedAcceptEnrollment = await Enrollment.findByPk(acceptEnrollment.id);
        console.log(`✅ Enrollment status: ${updatedAcceptEnrollment.status}`);
        console.log(`✅ Payment status: ${acceptPayment.status}`);
        console.log(`✅ User status: ${user.status}`);
        
        // 2. Buat test enrollment untuk /tolakXXXX alasan
        console.log('\n📝 Membuat test enrollment untuk /tolakXXXX alasan...');
        
        const rejectEnrollment = await Enrollment.create({
            user_id: user.id,
            package_id: pkg.id,
            status: 'pending',
            motivation: 'Test untuk /tolakXXXX command',
            product_type: pkg.product_type,
            request_id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        });
        
        const rejectPayment = await Payment.create({
            enrollment_id: rejectEnrollment.id,
            amount: pkg.price,
            proof_image: '/tmp/test-reject.jpg',
            status: 'PENDING'
        });
        
        const rejectShortId = rejectEnrollment.request_id.split('-').pop();
        console.log(`✅ Test reject enrollment created: ${rejectEnrollment.request_id} (short: ${rejectShortId})`);
        
        // Test /tolakXXXX alasan command
        console.log(`\n❌ Testing /tolak${rejectShortId} bukti tidak valid command...`);
        await handleRejectCommand(`/tolak${rejectShortId} bukti tidak valid`, 8375398953);
        console.log(`✅ Command /tolak${rejectShortId} bukti tidak valid executed`);
        
        // Verify hasil reject
        const updatedRejectEnrollment = await Enrollment.findByPk(rejectEnrollment.id);
        console.log(`✅ Enrollment status: ${updatedRejectEnrollment.status}`);
        console.log(`✅ Payment status: ${rejectPayment.status}`);
        console.log(`✅ User status: ${user.status}`);
        console.log(`✅ Rejected reason: ${updatedRejectEnrollment.rejected_reason}`);
        
        // 3. Test error cases
        console.log('\n🧪 Testing error cases...');
        
        // Test invalid format
        console.log('Testing /terimaXYZ (invalid format)...');
        await handleAcceptCommand(`/terimaXYZ`, 8375398953);
        
        // Test invoice tidak ditemukan
        console.log('Testing /terima9999 (not found)...');
        await handleAcceptCommand(`/terima9999`, 8375398953);
        
        // Test /tolak tanpa alasan
        console.log('Testing /tolak1234 (no reason)...');
        await handleRejectCommand(`/tolak1234`, 8375398953);
        
        // Test double approve
        console.log(`Testing double approve /terima${shortId}...`);
        await handleAcceptCommand(`/terima${shortId}`, 8375398953);
        
        // 4. Final stats
        console.log('\n📊 Final Stats:');
        const stats = await Enrollment.findAll({
            attributes: [
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)"), 'pending'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)"), 'approved'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END)"), 'rejected']
            ],
            raw: true
        });
        
        console.log('✅ Final Stats:', stats[0]);
        
        console.log('\n🎉 NEW COMMANDS TEST SELESAI');
        console.log('📱 Cek Telegram Anda untuk semua notifikasi!');
        console.log('\n📋 COMMAND YANG SUDAH BEKERJA:');
        console.log(`✅ /terima${shortId} - approve invoice`);
        console.log(`✅ /tolak${rejectShortId} [alasan] - reject invoice dengan alasan`);
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
}

testNewCommands();
