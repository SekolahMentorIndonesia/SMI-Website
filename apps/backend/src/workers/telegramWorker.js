// Telegram Worker - Decoupled process untuk kirim notifikasi
const { Enrollment, Payment, User, MentorPackage } = require('../models');
const telegramService = require('../services/telegram.service');

class TelegramWorker {
    constructor() {
        this.isRunning = false;
        this.interval = null;
    }

    // Start worker
    start() {
        if (this.isRunning) {
            console.log('🔄 Telegram worker already running');
            return;
        }

        console.log('🚀 Starting Telegram worker...');
        this.isRunning = true;
        
        // Run immediately
        this.processPendingNotifications();
        
        // Set interval untuk check setiap 30 detik
        this.interval = setInterval(() => {
            this.processPendingNotifications();
        }, 30000);
    }

    // Stop worker
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('⏹️ Telegram worker stopped');
    }

    // Process pending notifications
    async processPendingNotifications() {
        try {
            console.log('🔍 [WORKER] Processing pending notifications...');
            
            // Cari enrollment yang pending dan belum dikirim Telegram
            const pendingEnrollments = await Enrollment.findAll({
                where: { 
                    status: 'pending',
                    telegram_sent: false 
                },
                include: [
                    { model: User },
                    { model: MentorPackage },
                    { model: Payment }
                ],
                limit: 10 // Batch processing
            });

            if (pendingEnrollments.length === 0) {
                console.log('📭 [WORKER] No pending notifications');
                return;
            }

            console.log(`📬 [WORKER] Found ${pendingEnrollments.length} pending notifications`);

            for (const enrollment of pendingEnrollments) {
                await this.sendTelegramNotification(enrollment);
            }

        } catch (error) {
            console.error('❌ [WORKER] Error processing notifications:', error);
        }
    }

    // Kirim notifikasi Telegram
    async sendTelegramNotification(enrollment) {
        try {
            console.log(`📤 [WORKER] Sending notification for ${enrollment.request_id}`);
            
            // Prepare caption
            const caption = `🔔 NEW PAYMENT PENDING 🔔\n\n` +
                `📋 Request ID: ${enrollment.request_id}\n` +
                `👤 User: ${enrollment.User.name} (${enrollment.User.email})\n` +
                `📱 Telegram: ${enrollment.User.telegram_user || 'Belum ditambahkan'}\n` +
                `📞 Telepon: ${enrollment.User.phone_number || 'Belum ditambahkan'}\n` +
                `📦 Paket: ${enrollment.MentorPackage.name}\n` +
                `💰 Harga Paket: ${enrollment.MentorPackage.price}\n` +
                `💵 Jumlah Bayar: ${enrollment.Payment?.amount}\n` +
                `💳 Metode Bayar: Transfer Bank\n\n` +
                `💬 Deskripsi: Test dari website\n` +
                `📝 Motivasi: Test enrollment\n\n` +
                `Status: PENDING - Menunggu Verifikasi\n\n` +
                `Untuk verifikasi:\n` +
                `/terima ${enrollment.request_id} atau /tolak ${enrollment.request_id} [ALASAN]`;

            // Kirim ke Telegram
            let telegramResult;
            if (enrollment.Payment?.proof_image) {
                telegramResult = await telegramService.sendPhoto(enrollment.Payment.proof_image, caption);
            } else {
                telegramResult = await telegramService.sendMessage(caption);
            }

            // Update flag telegram_sent
            await enrollment.update({ telegram_sent: true });
            
            console.log(`✅ [WORKER] Telegram sent for ${enrollment.request_id}`);
            console.log(`📊 [WORKER] Telegram result:`, telegramResult.ok);
            
        } catch (error) {
            console.error(`❌ [WORKER] Failed to send Telegram for ${enrollment.request_id}:`, error.message);
            
            // Jangan update flag jika gagal, biarkan retry di next cycle
        }
    }

    // Manual trigger untuk testing
    async manualTrigger(enrollmentId = null) {
        console.log('🔧 [WORKER] Manual trigger activated');
        
        if (enrollmentId) {
            // Kirim untuk enrollment spesifik
            const enrollment = await Enrollment.findByPk(enrollmentId, {
                include: [User, MentorPackage, Payment]
            });
            
            if (enrollment) {
                await this.sendTelegramNotification(enrollment);
            }
        } else {
            // Kirim semua pending
            await this.processPendingNotifications();
        }
    }
}

// Export singleton
const telegramWorker = new TelegramWorker();
module.exports = telegramWorker;
