// Check user status in database
const { User } = require('./src/models');

async function checkUserStatus() {
    console.log('Checking user status in database...');
    
    try {
        // Get all users with their status
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'status']
        });
        
        console.log('All Users:');
        users.forEach(user => {
            console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
        });
        
        // Get specific user by email
        const dzarel = await User.findOne({
            where: { email: 'dzarelalghifari123@gmail.com' },
            include: [{
                association: 'Enrollments',
                include: ['MentorPackage', 'Payment']
            }]
        });
        
        if (dzarel) {
            console.log('\nDzarel\'s Detailed Info:');
            console.log(`Status: ${dzarel.status}`);
            console.log('Enrollments:');
            dzarel.Enrollments.forEach(enrollment => {
                console.log(`  - Enrollment ID: ${enrollment.id}, Status: ${enrollment.status}`);
                console.log(`    - Package: ${enrollment.MentorPackage?.name}, Type: ${enrollment.MentorPackage?.product_type}`);
                console.log(`    - Payment: ${enrollment.Payment?.id}, Status: ${enrollment.Payment?.status}`);
            });
        }
        
    } catch (error) {
        console.error('Error checking user status:', error);
    } finally {
        process.exit();
    }
}

checkUserStatus();
