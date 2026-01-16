const axios = require('axios');
require('dotenv').config();

const testSpecificChatId = async () => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = '8375398953'; // Chat ID without minus sign
        
        console.log(`Testing chat ID: ${chatId}`);
        
        const baseUrl = `https://api.telegram.org/bot${botToken}`;
        
        // Test with a simple text message
        const response = await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: 'Test message from SMI backend - trying without minus sign',
            parse_mode: 'HTML'
        });
        
        console.log('✅ Success! Message sent to chat ID:', chatId);
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('❌ Error testing chat ID:', chatId);
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
};

testSpecificChatId();
