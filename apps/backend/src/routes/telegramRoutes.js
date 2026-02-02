const express = require('express');
const router = express.Router();
const { handleTelegramWebhook } = require('../controllers/telegramController');

// Webhook endpoint for Telegram bot
router.post('/webhook', handleTelegramWebhook);

module.exports = router;
