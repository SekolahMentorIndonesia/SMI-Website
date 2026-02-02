const sequelize = require('./src/config/database');
const User = require('./src/models/User');

async function checkUsers() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');
    
    // Check database name
    const [result] = await sequelize.query('SELECT DATABASE() as db_name');
    console.log('Current database:', result[0].db_name);
    
    // List all tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('\nTables in database:', tables.map(table => Object.values(table)[0]).join(', '));
    
    // Check users table structure
    const [columns] = await sequelize.query('DESCRIBE users');
    console.log('\nUsers table columns:');
    columns.forEach(col => {
      console.log(`  ${col.Field} (${col.Type}) - ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Check all users
    const users = await User.findAll({ attributes: ['id', 'email', 'role', 'name'] });
    console.log('\nAll users in database:');
    users.forEach(user => {
      console.log(`  ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
    });
    
    // Test specific user lookup
    const testEmail = 'dzarelalghifari123@gmail.com';
    const user = await User.findOne({ where: { email: testEmail } });
    console.log(`\nUser lookup for ${testEmail}:`, user ? 'FOUND' : 'NOT FOUND');
    
    // Test with case insensitive search
    const userInsensitive = await User.findOne({ where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), '=', testEmail.toLowerCase()) });
    console.log(`User lookup (case insensitive) for ${testEmail}:`, userInsensitive ? 'FOUND' : 'NOT FOUND');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    // Close connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
checkUsers();
