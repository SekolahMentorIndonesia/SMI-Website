const { User } = require('./src/models');
require('dotenv').config();

const createUser = async () => {
    try {
        // Create a test user
        const user = await User.create({
            name: 'Dzarel',
            email: 'dzarel@gmail.com',
            telegram_user: '@Dzarel',
            phone_number: '0897654321',
            password: 'password123',
            role: 'user',
            status: 'pending'
        });
        
        console.log('✅ User created successfully!');
        console.log('User details:');
        console.log(`- ID: ${user.id}`);
        console.log(`- Name: ${user.name}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Telegram: ${user.telegram_user}`);
        console.log(`- Phone: ${user.phone_number}`);
        console.log(`- Role: ${user.role}`);
        console.log(`- Status: ${user.status}`);
        
        return user;
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('User with this email already exists. Trying to find existing user...');
            const existingUser = await User.findOne({ where: { email: 'dzarel@gmail.com' } });
            if (existingUser) {
                console.log('✅ Found existing user:');
                console.log(`- ID: ${existingUser.id}`);
                console.log(`- Name: ${existingUser.name}`);
                console.log(`- Email: ${existingUser.email}`);
                return existingUser;
            }
        }
        throw error;
    }
};

createUser();
