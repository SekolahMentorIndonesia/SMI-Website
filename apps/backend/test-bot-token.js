const axios = require('axios');
require('dotenv').config();

const testBotToken = async () => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        
        // Test if bot token is valid by getting bot information
        const response = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`);
        
        if (response.data.ok) {
            console.log('✅ Bot token is valid!');
            console.log('Bot information:');
            console.log(`- Username: @${response.data.result.username}`);
            console.log(`- Name: ${response.data.result.first_name}`);
            console.log(`- ID: ${response.data.result.id}`);
            
            console.log('\n📝 Next steps to get private chat ID:');
            console.log('1. Open Telegram');
            console.log(`2. Search for your bot: @${response.data.result.username}`);
            console.log('3. Start a private chat with the bot');
            console.log('4. Send any message to the bot');
            console.log('5. Run: node get-chat-id.js');
        } else {
            console.log('❌ Invalid bot token!');
        }
        
    } catch (error) {
        console.error('❌ Error testing bot token:', error.message);
        if (error.response?.data?.description) {
            console.error('Error description:', error.response.data.description);
        }
    }
};

testBotToken();
