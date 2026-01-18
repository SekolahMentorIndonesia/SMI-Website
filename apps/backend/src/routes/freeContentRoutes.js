const express = require('express');
const { auth, adminOnly } = require('../middlewares/authMiddleware');
const freeContentController = require('../controllers/freeContentController');

const router = express.Router();

// Public routes - only published content (no auth required)
router.get('/', freeContentController.getAllContent);
router.get('/:id', freeContentController.getContentById);

// Admin routes - require authentication and admin role
router.post('/', auth, adminOnly, freeContentController.createContent);
router.put('/:id', auth, adminOnly, freeContentController.updateContent);
router.delete('/:id', auth, adminOnly, freeContentController.deleteContent);

module.exports = router;
