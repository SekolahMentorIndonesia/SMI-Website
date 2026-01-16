const axios = require('axios');
require('dotenv').config();

const getChatId = async () => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const baseUrl = `https://api.telegram.org/bot${botToken}`;
        
        console.log('Getting updates from Telegram bot...');
        
        // Get updates from the bot to find the private chat ID
        const response = await axios.get(`${baseUrl}/getUpdates`);
        
        console.log('Updates received:', response.data);
        
        if (response.data.ok && response.data.result.length > 0) {
            console.log('\n=== Available Chat IDs ===');
            
            // Collect unique chat IDs from updates
            const chatIds = new Set();
            
            response.data.result.forEach(update => {
                if (update.message && update.message.chat) {
                    const chat = update.message.chat;
                    chatIds.add({
                        id: chat.id,
                        type: chat.type,
                        username: chat.username,
                        first_name: chat.first_name,
                        last_name: chat.last_name
                    });
                }
            });
            
            // Display all unique chats
            Array.from(chatIds).forEach(chat => {
                console.log(`\nChat ID: ${chat.id}`);
                console.log(`Type: ${chat.type}`);
                console.log(`Username: ${chat.username || 'N/A'}`);
                console.log(`Name: ${chat.first_name} ${chat.last_name || ''}`);
            });
            
            console.log('\n=== Instructions ===');
            console.log('1. Send a message to your bot in private chat');
            console.log('2. Run this script again');
            console.log('3. Look for the chat with type "private"');
            console.log('4. Update TELEGRAM_CHAT_ID in .env with that ID');
        } else {
            console.log('\nNo updates found. Please send a message to your bot first, then run this script again.');
            console.log('\n=== Instructions ===');
            console.log('1. Go to Telegram and search for your bot: @your_bot_username');
            console.log('2. Start a private chat with the bot');
            console.log('3. Send any message to the bot');
            console.log('4. Run this script again');
        }
        
    } catch (error) {
        console.error('Error getting chat ID:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

getChatId();
