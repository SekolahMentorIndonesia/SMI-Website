const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  request_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  package_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_type: {
    type: DataTypes.ENUM('komunitas', 'mentoring'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  approved_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejected_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  action_source: {
    type: DataTypes.ENUM('telegram', 'dashboard'),
    allowNull: true
  },
  telegram_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (enrollment) => {
      console.log('[DEBUG] Enrollment beforeCreate hook triggered');
      if (!enrollment.request_id) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        enrollment.request_id = `INV-${year}${month}${day}-${random}`;
        console.log('[DEBUG] Generated request_id:', enrollment.request_id);
      }
    }
  }
});

module.exports = Enrollment;
