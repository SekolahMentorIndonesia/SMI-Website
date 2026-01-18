// Test Telegram langsung - bukan mock
require('dotenv').config();
const axios = require('axios');

console.log('🤖 TEST TELEGRAM LANGSUNG');
console.log('============================');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

console.log('🔑 Bot Token:', botToken ? `${botToken.substring(0, 10)}...` : 'NOT SET');
console.log('💬 Chat ID:', chatId || 'NOT SET');

if (!botToken || !chatId) {
  console.log('❌ Telegram bot configuration missing!');
  process.exit(1);
}

async function testRealTelegram() {
  try {
    console.log('\n📤 Mengirim test message ke Telegram...');
    
    const message = `🧪 TEST MESSAGE - SMI PLATFORM\n\nIni adalah test pesan dari SMI Platform.\nWaktu: ${new Date().toISOString()}`;
    
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.ok) {
      console.log('\n🎉 BERHASIL - Telegram terkirim!');
      console.log('📱 Cek Telegram Anda sekarang!');
    } else {
      console.log('\n❌ GAGAL - Response tidak ok');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR KIRIM TELEGRAM:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRealTelegram();
