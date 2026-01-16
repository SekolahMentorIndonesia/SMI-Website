const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

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
app.use('/api/ai', require('./routes/aiRoutes'));

const errorHandler = require('./middlewares/errorMiddleware');

// Error handling middleware
app.use(errorHandler);

module.exports = app;
