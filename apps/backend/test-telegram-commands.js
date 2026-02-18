// Test Telegram commands /terima dan /tolak langsung
const { Enrollment, Payment, User, MentorPackage } = require('./src/models');
const { handleAcceptCommand, handleRejectCommand } = require('./src/controllers/telegramController');

async function testTelegramCommands() {
    console.log('🤖 TEST TELEGRAM COMMANDS');
    console.log('==========================');
    
    try {
        // 1. Cari pending enrollment
        console.log('\n⏳ Mencari pending enrollment...');
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
            console.log('❌ Tidak ada pending enrollment');
            
            // Buat test enrollment baru
            console.log('\n📝 Membuat test enrollment...');
            const user = await User.findOne({ where: { email: 'superadmin@smi.multipriority.com' } });
            const pkg = await MentorPackage.findOne();
            
            const newEnrollment = await Enrollment.create({
                user_id: user.id,
                package_id: pkg.id,
                status: 'pending',
                motivation: 'Test untuk Telegram commands',
                product_type: pkg.product_type,
                request_id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
            });
            
            const newPayment = await Payment.create({
                enrollment_id: newEnrollment.id,
                amount: pkg.price,
                proof_image: '/tmp/test.jpg',
                status: 'PENDING'
            });
            
            console.log(`✅ Test enrollment created: ${newEnrollment.request_id}`);
            
            // Reload dengan include
            const testEnrollment = await Enrollment.findByPk(newEnrollment.id, {
                include: [
                    { model: User },
                    { model: MentorPackage },
                    { model: Payment }
                ]
            });
            
            // Test /terima command
            console.log('\n✅ Testing /terima command...');
            await handleAcceptCommand(`/terima ${testEnrollment.request_id}`, 8375398953);
            console.log(`✅ Command /terima ${testEnrollment.request_id} executed`);
            
            // Verify hasil
            const updatedEnrollment = await Enrollment.findByPk(testEnrollment.id);
            console.log(`✅ Enrollment status: ${updatedEnrollment.status}`);
            console.log(`✅ Payment status: ${testEnrollment.Payment.status}`);
            console.log(`✅ User status: ${testEnrollment.User.status}`);
            
        } else {
            console.log(`✅ Found pending enrollment: ${pendingEnrollment.request_id}`);
            
            // Test /terima command
            console.log('\n✅ Testing /terima command...');
            await handleAcceptCommand(`/terima ${pendingEnrollment.request_id}`, 8375398953);
            console.log(`✅ Command /terima ${pendingEnrollment.request_id} executed`);
            
            // Verify hasil
            const updatedEnrollment = await Enrollment.findByPk(pendingEnrollment.id);
            console.log(`✅ Enrollment status: ${updatedEnrollment.status}`);
            console.log(`✅ Payment status: ${pendingEnrollment.Payment.status}`);
            console.log(`✅ User status: ${pendingEnrollment.User.status}`);
        }
        
        // 2. Test /tolak command dengan enrollment baru
        console.log('\n❌ Testing /tolak command...');
        
        // Buat enrollment baru untuk test reject
        const user = await User.findOne({ where: { email: 'superadmin@smi.multipriority.com' } });
        const pkg = await MentorPackage.findOne();
        
        const rejectEnrollment = await Enrollment.create({
            user_id: user.id,
            package_id: pkg.id,
            status: 'pending',
            motivation: 'Test untuk reject command',
            product_type: pkg.product_type,
            request_id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        });
        
        const rejectPayment = await Payment.create({
            enrollment_id: rejectEnrollment.id,
            amount: pkg.price,
            proof_image: '/tmp/test-reject.jpg',
            status: 'PENDING'
        });
        
        console.log(`✅ Test reject enrollment created: ${rejectEnrollment.request_id}`);
        
        // Test /tolak command
        await handleRejectCommand(`/tolak ${rejectEnrollment.request_id} Test reject reason`, 8375398953);
        console.log(`✅ Command /tolak ${rejectEnrollment.request_id} executed`);
        
        // Verify hasil reject
        const rejectedEnrollment = await Enrollment.findByPk(rejectEnrollment.id);
        console.log(`✅ Enrollment status: ${rejectedEnrollment.status}`);
        console.log(`✅ Payment status: ${rejectPayment.status}`);
        console.log(`✅ User status: ${user.status}`);
        console.log(`✅ Rejected reason: ${rejectedEnrollment.rejected_reason}`);
        
        // 3. Final stats
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
        
        console.log('\n🎉 TELEGRAM COMMANDS TEST SELESAI');
        console.log('📱 Cek Telegram Anda untuk semua notifikasi!');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
}

testTelegramCommands();
