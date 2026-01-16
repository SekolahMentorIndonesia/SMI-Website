const User = require('./User');
const MentorPackage = require('./MentorPackage');
const Enrollment = require('./Enrollment');
const Payment = require('./Payment');
const FreeContent = require('./FreeContent');

// User <-> Enrollment
User.hasMany(Enrollment, { foreignKey: 'user_id' });
Enrollment.belongsTo(User, { foreignKey: 'user_id' });

// MentorPackage <-> Enrollment
MentorPackage.hasMany(Enrollment, { foreignKey: 'package_id' });
Enrollment.belongsTo(MentorPackage, { foreignKey: 'package_id' });

// Enrollment <-> Payment
Enrollment.hasOne(Payment, { foreignKey: 'enrollment_id' });
Payment.belongsTo(Enrollment, { foreignKey: 'enrollment_id' });

module.exports = {
  User,
  MentorPackage,
  Enrollment,
  Payment,
  FreeContent
};
