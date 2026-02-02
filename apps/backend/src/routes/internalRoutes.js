// Internal API routes - server-to-server communication
const express = require('express');
const router = express.Router();
const telegramWorker = require('../workers/telegramWorker');

// Internal endpoint untuk trigger Telegram worker
router.post('/send-telegram', async (req, res) => {
    try {
        console.log('🔧 [INTERNAL] Telegram trigger received');
        
        // Trigger worker
        await telegramWorker.processPendingNotifications();
        
        res.json({ 
            success: true, 
            message: 'Telegram worker triggered successfully' 
        });
        
    } catch (error) {
        console.error('❌ [INTERNAL] Telegram trigger failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to trigger Telegram worker' 
        });
    }
});

// Manual trigger untuk enrollment spesifik
router.post('/send-telegram/:enrollmentId', async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        console.log(`🔧 [INTERNAL] Manual trigger for enrollment ${enrollmentId}`);
        
        // Trigger worker untuk enrollment spesifik
        await telegramWorker.manualTrigger(parseInt(enrollmentId));
        
        res.json({ 
            success: true, 
            message: `Telegram sent for enrollment ${enrollmentId}` 
        });
        
    } catch (error) {
        console.error('❌ [INTERNAL] Manual trigger failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send Telegram' 
        });
    }
});

module.exports = router;
