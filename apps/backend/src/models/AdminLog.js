const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminLog = sequelize.define('AdminLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  admin_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('approve', 'reject'),
    allowNull: false
  },
  request_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action_source: {
    type: DataTypes.ENUM('telegram', 'dashboard'),
    allowNull: false
  },
  rejected_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'admin_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AdminLog;
