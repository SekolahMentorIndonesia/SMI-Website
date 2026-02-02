const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const telegramWorker = require('./workers/telegramWorker');

const app = express();

// Start Telegram Worker (STRATEGI 1 - DECOUPLED)
telegramWorker.start();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transaction', require('./routes/transaction.routes'));
app.use('/api/telegram', require('./routes/telegramRoutes'));
app.use('/api/internal', require('./routes/internalRoutes')); // Internal API
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/free-content', require('./routes/freeContentRoutes'));

const errorHandler = require('./middlewares/errorMiddleware');

// Error handling middleware
app.use(errorHandler);

module.exports = app;
