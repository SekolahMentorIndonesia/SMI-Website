const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email sudah terdaftar',
      name: 'email'
    },
    validate: {
      isEmail: {
        msg: 'Format email tidak valid'
      },
      notEmpty: {
        msg: 'Email tidak boleh kosong'
      }
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password tidak boleh kosong'
      },
      len: {
        args: [6, 100],
        msg: 'Password minimal 6 karakter'
      }
    }
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Nomor HP tidak boleh kosong'
      },
      is: {
        args: /^[0-9]{10,15}$/,
        msg: 'Format nomor HP tidak valid (10-15 digit angka)'
      }
    }
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  telegram_user: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'superadmin'),
    defaultValue: 'user'
  },
  account_status: {
    type: DataTypes.ENUM('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED'),
    defaultValue: 'PENDING_VERIFICATION'
  },
  status: {
    type: DataTypes.ENUM('guest', 'belum_gabung', 'pending', 'approved', 'rejected', 'menunggu_masuk_komunitas', 'sudah_bergabung'),
    defaultValue: 'guest'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
