// Test dashboard API dan approve/reject
const { Enrollment, Payment, User, MentorPackage } = require('./src/models');

async function testDashboard() {
    console.log('📊 TEST DASHBOARD API');
    console.log('====================');
    
    try {
        // 1. Test dashboard stats
        console.log('\n📈 Mengambil dashboard stats...');
        const stats = await Enrollment.findAll({
            attributes: [
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)"), 'pending'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)"), 'approved'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END)"), 'rejected']
            ],
            raw: true
        });
        
        console.log('✅ Dashboard Stats:', stats[0]);
        
        // 2. Test pending enrollments
        console.log('\n⏳ Mengambil pending enrollments...');
        const pendingEnrollments = await Enrollment.findAll({
            where: { status: 'pending' },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: MentorPackage },
                { model: Payment }
            ],
            order: [['created_at', 'DESC']]
        });
        
        console.log(`✅ Found ${pendingEnrollments.length} pending enrollments`);
        
        if (pendingEnrollments.length > 0) {
            const enrollment = pendingEnrollments[0];
            console.log('\n📋 Detail Pending Enrollment:');
            console.log(`   Request ID: ${enrollment.request_id}`);
            console.log(`   User: ${enrollment.User.name} (${enrollment.User.email})`);
            console.log(`   Package: ${enrollment.MentorPackage.name}`);
            console.log(`   Amount: ${enrollment.Payment?.amount || 'N/A'}`);
            console.log(`   Status: ${enrollment.status}`);
            console.log(`   Created: ${enrollment.created_at}`);
            
            // 3. Test approve enrollment
            console.log('\n✅ Testing approve enrollment...');
            const adminUser = await User.findOne({ where: { role: 'superadmin' } });
            
            if (adminUser) {
                console.log(`Admin: ${adminUser.email}`);
                
                // Update enrollment status
                await enrollment.update({
                    status: 'approved',
                    approved_by: adminUser.email,
                    approved_at: new Date(),
                    action_source: 'dashboard'
                });
                
                // Update payment status
                if (enrollment.Payment) {
                    await enrollment.Payment.update({ status: 'VERIFIED' });
                    console.log(`✅ Payment ${enrollment.Payment.id} updated to VERIFIED`);
                }
                
                // Update user status
                if (enrollment.MentorPackage.product_type === 'komunitas') {
                    await enrollment.User.update({ status: 'menunggu_masuk_komunitas' });
                } else {
                    await enrollment.User.update({ status: 'mentoring_approved' });
                }
                
                console.log(`✅ Enrollment ${enrollment.request_id} APPROVED`);
                console.log(`✅ User status updated to: ${enrollment.User.status}`);
                
                // 4. Test Telegram notification for approval
                const telegramService = require('./src/services/telegram.service');
                try {
                    const message = `✅ TEST APPROVAL - Request ${enrollment.request_id} telah DISETUJUI\nAdmin: ${adminUser.email}\nUser: ${enrollment.User.name}\nPackage: ${enrollment.MentorPackage.name}`;
                    await telegramService.sendMessage(message);
                    console.log('✅ Telegram approval notification sent');
                } catch (telegramError) {
                    console.error('❌ Telegram error:', telegramError.message);
                }
                
            } else {
                console.log('❌ Superadmin user not found');
            }
        } else {
            console.log('⚠️  No pending enrollments found');
        }
        
        // 5. Verify final stats
        console.log('\n🔍 Final verification...');
        const finalStats = await Enrollment.findAll({
            attributes: [
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'total'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)"), 'pending'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END)"), 'approved'],
                [require('sequelize').literal("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END)"), 'rejected']
            ],
            raw: true
        });
        
        console.log('✅ Final Stats:', finalStats[0]);
        
        console.log('\n🎉 DASHBOARD TEST SELESAI');
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
}

testDashboard();
