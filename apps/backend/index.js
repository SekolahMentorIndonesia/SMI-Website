const app = require('./src/app');
const { PORT, TELEGRAM } = require('./src/config/env');
const axios = require('axios');
const telegramService = require('./src/services/telegram.service');

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Uploads available at http://localhost:${PORT}/uploads`);
        
        // Start Telegram Polling if both token and chat ID are provided
        if (TELEGRAM.BOT_TOKEN && TELEGRAM.CHAT_ID) {
            startTelegramPolling();
        } else {
            console.warn('⚠️ Telegram configuration incomplete. Polling skipped.');
            if (!TELEGRAM.BOT_TOKEN) {
                console.warn('   - Bot Token is not properly set');
            }
            if (!TELEGRAM.CHAT_ID) {
                console.warn('   - Chat ID is not properly set');
            }
        }
    });
};

let lastUpdateId = 0;

const startTelegramPolling = async () => {
    console.log('🤖 Telegram Bot Polling started...');
    
    let pollingActive = true;
    
    const poll = async () => {
        if (!pollingActive) return;
        
        try {
            const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/getUpdates`, {
                params: { offset: lastUpdateId + 1, timeout: 10 }
            });

            const updates = response.data.result;
            for (const update of updates) {
                lastUpdateId = update.update_id;
                
                if (update.message && update.message.text) {
                    const text = update.message.text;
                    const chatId = update.message.chat.id;

                    console.log(`Received message from chat ID: ${chatId}, Authorized chat ID: ${TELEGRAM.CHAT_ID}`);
                    console.log(`Message text: ${text}`);
                    
                    // Security check: only respond to the authorized chat ID
                    if (chatId.toString() !== TELEGRAM.CHAT_ID.toString()) {
                        console.log(`Unauthorized chat ID: ${chatId}`);
                        continue;
                    }

                    if (text.startsWith('/terima')) {
                        let paymentId;
                        if (text.includes(' ')) {
                            // Format: /terima 4
                            const parts = text.split(' ');
                            paymentId = parseInt(parts[1], 10);
                        } else {
                            // Format: /terima4
                            paymentId = parseInt(text.replace('/terima', ''), 10);
                        }
                        
                        if (!isNaN(paymentId)) {
                            // Import command handlers directly to avoid circular dependencies
                            const { handleAcceptCommand } = require('./src/controllers/telegramController');
                            await handleAcceptCommand(text, chatId);
                        }
                    } else if (text.startsWith('/tolak')) {
                        let paymentId;
                        if (text.includes(' ')) {
                            // Format: /tolak 4 [ALASAN]
                            const parts = text.split(' ');
                            paymentId = parseInt(parts[1], 10);
                        } else {
                            // Format: /tolak4
                            paymentId = parseInt(text.replace('/tolak', ''), 10);
                        }
                        
                        if (!isNaN(paymentId)) {
                            // Import command handlers directly to avoid circular dependencies
                            const { handleRejectCommand } = require('./src/controllers/telegramController');
                            await handleRejectCommand(text, chatId);
                        }
                    } else if (text === '/start') {
                        await telegramService.sendMessage('👋 Halo Admin SMI! Saya siap menerima notifikasi pembayaran.');
                    }
                }
            }
        } catch (error) {
            // Handle specific error codes
            if (error.code === 'ECONNABORTED') {
                // Ignore timeout errors which are expected with long polling
            } else {
                // Check if it's a 409 Conflict error
                const is409Error = error.response && error.response.status === 409;
                
                if (is409Error) {
                    // 409 error: Conflict - another bot instance is running or invalid offset
                    console.error('Telegram Polling Conflict (409): Another instance may be running or invalid offset.');
                    console.error('Stopping polling completely to avoid continuous errors...');
                    pollingActive = false; // Stop polling completely for 409 errors
                    return;
                } else {
                    console.error('Telegram Polling Error:', error.message);
                    if (error.response) {
                        console.error('Response status:', error.response.status);
                        console.error('Response data:', error.response.data);
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
                }
            }
        } finally {
            // Continue polling
            setTimeout(poll, 1000); // Poll with 1 second delay
        }
    };
    
    poll();
};

startServer();
