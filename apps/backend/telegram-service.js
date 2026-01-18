// Telegram Bot Service for sending notifications
const axios = require('axios');

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(message) {
    if (!this.botToken || !this.chatId) {
      console.log('❌ Telegram bot token or chat ID not configured');
      return false;
    }

    try {
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });

      console.log('✅ Telegram notification sent successfully');
      console.log('📱 Message ID:', response.data.result.message_id);
      return true;
    } catch (error) {
      console.error('❌ Failed to send Telegram notification:', error.message);
      console.error('📊 Error details:', error.response?.data);
      return false;
    }
  }

  formatEnrollmentMessage(enrollmentData) {
    const { name, email, phone_number, package_id, payment_amount, payment_method, motivation } = enrollmentData;
    
    // Get package name
    const packageName = this.getPackageName(package_id);
    
    return `
🔔 <b>ENROLLMENT BARU!</b>

👤 <b>Nama:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Telepon:</b> ${phone_number}
📦 <b>Paket:</b> ${packageName}
💰 <b>Jumlah:</b> ${payment_amount}
💳 <b>Metode:</b> ${payment_method?.toUpperCase() || 'TRANSFER'}

📝 <b>Motivasi:</b>
${motivation?.substring(0, 200) || 'Tidak ada motivasi'}

---
⏰ <i>${new Date().toLocaleString('id-ID')}</i>
    `.trim();
  }

  getPackageName(packageId) {
    const packages = {
      1: 'FREE',
      2: 'PREMIUM', 
      3: 'VIP',
      4: 'ENTERPRISE'
    };
    return packages[packageId] || 'UNKNOWN';
  }

  async sendEnrollmentNotification(enrollmentData) {
    const message = this.formatEnrollmentMessage(enrollmentData);
    return await this.sendMessage(message);
  }
}

module.exports = new TelegramService();
