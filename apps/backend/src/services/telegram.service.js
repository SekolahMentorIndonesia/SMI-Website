const axios = require('axios');
const { TELEGRAM } = require('../config/env');

class TelegramService {
    constructor() {
        this.baseUrl = `https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}`;
        this.chatId = TELEGRAM.CHAT_ID;
        this.isConfigured = !!TELEGRAM.BOT_TOKEN && !!TELEGRAM.CHAT_ID;
    }

    async sendMessage(text) {
        // Check if Telegram is configured
        if (!this.isConfigured) {
            console.warn('Telegram not configured - skipping message:', text.substring(0, 50) + '...');
            return { success: false, error: 'Telegram not configured' };
        }
        
        try {
            const response = await axios.post(`${this.baseUrl}/sendMessage`, {
                chat_id: this.chatId,
                text: text
            });

            // Only consider success if Telegram API returns HTTP 200
            if (response.status !== 200) {
                throw new Error(`Telegram API error: ${response.status} - ${response.statusText}`);
            }
            return response.data;
        } catch (error) {
            console.error('Telegram sendMessage error:', error.message);
            if (error.response) {
                console.error('   Response status:', error.response.status);
                console.error('   Response data:', error.response.data);
            }
            throw error;
        }
    }

    async sendPhoto(photoPath, caption) {
        // Check if Telegram is configured
        if (!this.isConfigured) {
            console.warn('Telegram not configured - skipping photo');
            return { success: false, error: 'Telegram not configured' };
        }
        
        const FormData = require('form-data');
        const fs = require('fs');
        const form = new FormData();
        
        // Check if file exists
        if (!fs.existsSync(photoPath)) {
            console.error('Telegram sendPhoto error: Photo file not found:', photoPath);
            throw new Error(`Photo file not found: ${photoPath}`);
        }
        
        try {
            form.append('chat_id', this.chatId);
            form.append('photo', fs.createReadStream(photoPath));
            form.append('caption', caption);
            form.append('parse_mode', 'MarkdownV2');

            const response = await axios.post(`${this.baseUrl}/sendPhoto`, form, {
                headers: form.getHeaders()
            });

            // Only consider success if Telegram API returns HTTP 200
            if (response.status !== 200) {
                throw new Error(`Telegram API error: ${response.status} - ${response.statusText}`);
            }
            return response.data;
        } catch (error) {
            console.error('Telegram sendPhoto error:', error.message);
            if (error.response) {
                console.error('   Response status:', error.response.status);
                console.error('   Response data:', error.response.data);
            }
            throw error;
        }
    }

    // Community-specific methods
    async sendCommunityPaymentNotification(payment, user, pkg) {
        const caption = `🔔 NEW COMMUNITY PAYMENT PENDING 🔔\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name}\n` +
            `📧 Email: ${user.email}\n` +
            `📱 Nomor HP: ${user.phone_number}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `💰 Harga: Rp${pkg.price}\n` +
            `💵 Jumlah Bayar: Rp${payment.amount}\n\n` +
            `Status: PENDING - Menunggu Verifikasi\n\n` +
            `Untuk verifikasi komunitas: /terima ${payment.id} atau /tolak ${payment.id}`;
        
        return await this.sendPhoto(payment.proof_image, caption);
    }

    async sendCommunityPaymentApproved(payment, user, pkg) {
        const message = `✅ COMMUNITY PAYMENT APPROVED ✅\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name}\n` +
            `📧 Email: ${user.email}\n` +
            `📱 Nomor HP: ${user.phone_number}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `Status: VERIFIED\n\n` +
            `User akan menerima notifikasi untuk bergabung ke komunitas.`;
        
        return await this.sendMessage(message);
    }

    async sendCommunityPaymentRejected(payment, user, pkg, reason) {
        const message = `❌ COMMUNITY PAYMENT REJECTED ❌\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name}\n` +
            `📧 Email: ${user.email}\n` +
            `📱 Nomor HP: ${user.phone_number}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `Alasan: ${reason}\n` +
            `Status: REJECTED\n\n` +
            `User akan menerima notifikasi penolakan.`;
        
        return await this.sendMessage(message);
    }

    // Mentoring-specific methods
    async sendMentoringPaymentNotification(payment, user, pkg) {
        const caption = `🔔 NEW MENTORING PAYMENT PENDING 🔔\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name}\n` +
            `📧 Email: ${user.email}\n` +
            `📱 Nomor HP: ${user.phone_number}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `💰 Harga: Rp${pkg.price}\n` +
            `💵 Jumlah Bayar: Rp${payment.amount}\n\n` +
            `Status: PENDING - Menunggu Verifikasi\n\n` +
            `Untuk verifikasi mentoring: /terima ${payment.id} atau /tolak ${payment.id}`;
        
        return await this.sendPhoto(payment.proof_image, caption);
    }

    async sendMentoringPaymentApproved(payment, user, pkg) {
        const message = `✅ MENTORING PAYMENT APPROVED ✅\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name}\n` +
            `📧 Email: ${user.email}\n` +
            `📱 Nomor HP: ${user.phone_number}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `Status: VERIFIED\n\n` +
            `User akan menerima notifikasi untuk follow-up manual mentoring.`;
        
        return await this.sendMessage(message);
    }

    async sendMentoringPaymentRejected(payment, user, pkg, reason) {
        const message = `❌ MENTORING PAYMENT REJECTED ❌\n\n` +
            `📋 ID Pembelian: #${payment.id}\n` +
            `👤 User: ${user.name}\n` +
            `📧 Email: ${user.email}\n` +
            `📱 Nomor HP: ${user.phone_number}\n` +
            `📦 Paket: ${pkg.name}\n` +
            `Alasan: ${reason}\n` +
            `Status: REJECTED\n\n` +
            `User akan menerima notifikasi penolakan.`;
        
        return await this.sendMessage(message);
    }
}

module.exports = new TelegramService();
