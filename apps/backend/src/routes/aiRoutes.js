const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Endpoint untuk chat dengan AI
router.post('/chat', aiController.chatWithAI);

module.exports = router;