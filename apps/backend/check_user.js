const { User } = require('./src/models');
const sequelize = require('./src/config/database');

async function check() {
  try {
    const user = await User.findOne({ where: { email: 'admin@smi.multipriority.com' } });
    if (user) {
      console.log('User found:', user.toJSON());
      const isMatch = await user.comparePassword('passwordadmin');
      console.log('Password match:', isMatch);
    } else {
      console.log('User not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
