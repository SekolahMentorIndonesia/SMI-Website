const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const telegramService = require('./telegram-service');
require('dotenv').config();

const app = express();

// Load test users
const testUsers = require('./test-users.json');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Mock authentication
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body.email);
  
  const { email, password } = req.body;
  const user = testUsers.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }
  
  // Verify password (compare with plain text since we have both)
  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
});

// Mock user profile
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const user = testUsers.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Enrollment endpoint
app.post('/api/user/enrollment', upload.single('proof_image'), async (req, res) => {
  console.log('🎯 Enrollment endpoint hit!');
  console.log('📊 Request body:', req.body);
  console.log('📎 Request file:', req.file);
  
  // Extract enrollment data
  const { package_id, name, email, phone_number, motivation, payment_method, proof_description, payment_amount } = req.body;
  
  // Mock successful response
  const enrollmentData = {
    id: Math.floor(Math.random() * 1000) + 1,
    status: 'pending',
    package_id,
    name,
    email,
    phone_number,
    motivation,
    payment_method,
    proof_description,
    payment_amount,
    proof_image: req.file ? {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : null,
    created_at: new Date().toISOString()
  };
  
  // Send Telegram notification (real)
  console.log('📱 Sending Telegram notification...');
  console.log('📝 Enrollment details:', {
    name,
    email,
    phone: phone_number,
    package: package_id,
    amount: payment_amount,
    method: payment_method,
    motivation: motivation?.substring(0, 100) + '...',
    hasProofImage: !!req.file
  });
  
  // Send to Telegram bot
  try {
    const telegramSent = await telegramService.sendEnrollmentNotification({
      name,
      email,
      phone_number,
      package_id,
      payment_amount,
      payment_method,
      motivation
    });
    
    if (telegramSent) {
      console.log('✅ Telegram notification sent successfully!');
    } else {
      console.log('❌ Failed to send Telegram notification');
    }
  } catch (telegramError) {
    console.error('❌ Telegram service error:', telegramError.message);
  }
  
  res.status(200).json({
    success: true,
    message: 'Enrollment created successfully',
    enrollment: enrollmentData
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    users: testUsers.length,
    timestamp: new Date().toISOString()
  });
});

// List users endpoint
app.get('/api/test/users', (req, res) => {
  res.json({
    success: true,
    users: testUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      created_at: u.created_at
    }))
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📡 Test endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - Users: http://localhost:${PORT}/api/test/users`);
  console.log(`👥 Available users:`);
  testUsers.forEach(user => {
    console.log(`   - ${user.email} (${user.role})`);
  });
});
