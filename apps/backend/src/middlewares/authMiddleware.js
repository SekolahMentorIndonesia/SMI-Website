const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware untuk verifikasi token JWT dan otorisasi role
// auth: Verifikasi token dan set req.user
// adminOnly: Memastikan user memiliki role admin
// userOnly: Memastikan user memiliki role user
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  // Allow both admin and superadmin roles
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    console.warn(`Unauthorized admin access attempt by user: ${req.user.email} (Role: ${req.user.role})`);
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Superadmin only middleware
const superadminOnly = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    console.warn(`Unauthorized superadmin access attempt by user: ${req.user.email} (Role: ${req.user.role})`);
    return res.status(403).json({ message: 'Access denied. Superadmin only.' });
  }
  next();
};

const userOnly = (_, __, next) => {
  // Allow any authenticated user to access user routes
  // This includes users with roles like 'user', 'admin', 'owner', etc.
  next();
};

module.exports = { auth, adminOnly, superadminOnly, userOnly };
