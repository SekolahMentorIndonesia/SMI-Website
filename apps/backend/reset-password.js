const { User } = require('./src/models');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    try {
        // Sync database
        await sequelize.sync();
        
        // Find the user
        const user = await User.findOne({ where: { email: 'dzarel@gmail.com' } });
        if (!user) {
            console.log('❌ User not found');
            return;
        }
        
        // Set new password
        const newPassword = 'password123';
        user.password = newPassword;
        await user.save();
        
        // Verify the password was hashed correctly
        const isMatch = await bcrypt.compare(newPassword, user.password);
        
        console.log('✅ User password reset successfully!');
        console.log('User details:');
        console.log(`- ID: ${user.id}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Role: ${user.role}`);
        console.log(`- Status: ${user.status}`);
        console.log(`- Password match: ${isMatch}`);
        
    } catch (error) {
        console.error('❌ Error resetting password:', error.message);
    } finally {
        await sequelize.close();
    }
};

resetPassword();