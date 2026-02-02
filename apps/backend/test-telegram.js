// Test script to check Telegram bot status and process /terima command manually
const { TELEGRAM } = require('./src/config/env');
const axios = require('axios');
const { Payment, Enrollment, User, MentorPackage } = require('./src/models');

async function testTelegramBot() {
    console.log('Testing Telegram Bot...');
    console.log('Bot Token:', TELEGRAM.BOT_TOKEN);
    console.log('Chat ID:', TELEGRAM.CHAT_ID);
    
    try {
        // Get bot info
        const botInfo = await axios.get(`https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/getMe`);
        console.log('Bot Info:', botInfo.data.result);
        
        // Get recent updates
        const updates = await axios.get(`https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/getUpdates`);
        console.log('Recent Updates:', updates.data.result);
        
    } catch (error) {
        console.error('Error testing Telegram bot:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

async function processAcceptCommand(paymentId) {
    console.log(`\nProcessing /terima command for payment ID: ${paymentId}`);
    
    try {
        // Find payment with full relations
        const payment = await Payment.findByPk(paymentId, {
            include: [{
                model: Enrollment,
                include: [MentorPackage, User]
            }]
        });

        if (!payment) {
            console.log(`Payment not found: ${paymentId}`);
            return;
        }

        const enrollment = payment.Enrollment;
        const user = enrollment.User;
        const pkg = enrollment.MentorPackage;
        
        console.log(`Found payment: ${payment.id}, User: ${user.id} (${user.email}), Package: ${pkg.name} (${pkg.product_type})`);
        console.log('Current user status:', user.status);

        // Update payment status to VERIFIED
        payment.status = 'VERIFIED';
        await payment.save();
        console.log('Updated payment status to VERIFIED');

        // Update enrollment status to APPROVED
        enrollment.status = 'APPROVED';
        await enrollment.save();
        console.log('Updated enrollment status to APPROVED');

        // Handle different flows based on product type
        if (pkg.product_type === 'komunitas') {
            // Update user status for community flow
            user.status = 'menunggu_masuk_komunitas';
            await user.save();
            console.log('Updated user status to menunggu_masuk_komunitas');
        } else {
            // For mentoring, use different user status
            user.status = 'mentoring_approved';
            await user.save();
            console.log('Updated user status to mentoring_approved');
        }
        
        console.log('Command processed successfully!');
    } catch (error) {
        console.error('Error processing /terima command:', error);
        console.error('Error stack:', error.stack);
    }
}

// Run the test
testTelegramBot().then(() => {
    // Process payment ID 7 manually
    processAcceptCommand(7);
});
