const User = require('./User');
const MentorPackage = require('./MentorPackage');
const Enrollment = require('./Enrollment');
const Payment = require('./Payment');
const FreeContent = require('./FreeContent');
const AdminLog = require('./AdminLog');

// User <-> Enrollment
User.hasMany(Enrollment, { foreignKey: 'user_id' });
Enrollment.belongsTo(User, { foreignKey: 'user_id' });

// MentorPackage <-> Enrollment
MentorPackage.hasMany(Enrollment, { foreignKey: 'package_id' });
Enrollment.belongsTo(MentorPackage, { foreignKey: 'package_id' });

// Enrollment <-> Payment
Enrollment.hasOne(Payment, { foreignKey: 'enrollment_id' });
Payment.belongsTo(Enrollment, { foreignKey: 'enrollment_id' });

// Admin Log associations
User.hasMany(AdminLog, { foreignKey: 'admin_id' });
AdminLog.belongsTo(User, { foreignKey: 'admin_id' });

// FreeContent associations
User.hasMany(FreeContent, { foreignKey: 'created_by' });
FreeContent.belongsTo(User, { foreignKey: 'created_by', as: 'User' });

module.exports = {
  User,
  MentorPackage,
  Enrollment,
  Payment,
  FreeContent,
  AdminLog
};
