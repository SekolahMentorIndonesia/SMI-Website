// Script to check the actual database schema for users table
const sequelize = require('./src/config/database');

async function checkSchema() {
  try {
    // Get the table description
    const [results] = await sequelize.query('DESCRIBE users');
    
    console.log('Users Table Schema:');
    console.log('----------------------------------------');
    results.forEach(column => {
      console.log(`${column.Field}: ${column.Type} (Null: ${column.Null}, Default: ${column.Default})`);
    });
    
    // Get the enum values for status column specifically
    const [enumResults] = await sequelize.query(
      "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'status'"
    );
    
    if (enumResults.length > 0) {
      console.log('\nStatus Enum Values:', enumResults[0].COLUMN_TYPE);
    }
    
  } catch (error) {
    console.error('Error checking schema:', error.message);
  } finally {
    // Close database connection
    process.exit();
  }
}

checkSchema();
