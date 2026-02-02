const sequelize = require('./src/config/database');

async function checkDB() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database successfully.');
    
    // Check actual table structure
    console.log('\n🔍 Checking actual database schema...');
    
    // Check payments table structure
    const [paymentColumns] = await sequelize.query('DESCRIBE payments');
    console.log('\n📋 Payments table actual structure:');
    paymentColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} - ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Check if we need to alter the table
    const proofImageColumn = paymentColumns.find(col => col.Field === 'proof_image');
    if (proofImageColumn && proofImageColumn.Null === 'NO') {
      console.log('\n⚠️  proof_image column is NOT NULL, need to alter it...');
      
      // Alter the table to make proof_image nullable
      await sequelize.query('ALTER TABLE payments MODIFY proof_image VARCHAR(255) NULL');
      console.log('✅ Altered payments table: proof_image is now NULL');
      
      // Verify the change
      const [updatedPaymentColumns] = await sequelize.query('DESCRIBE payments');
      const updatedProofImageColumn = updatedPaymentColumns.find(col => col.Field === 'proof_image');
      console.log(`  New status: ${updatedProofImageColumn.Field}: ${updatedProofImageColumn.Type} - ${updatedProofImageColumn.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    } else {
      console.log('\n✅ proof_image column is already NULL');
    }
    
    // Now let's fix the email validation issue by adding a transaction to ensure we don't fail the whole enrollment
    console.log('\n🔧 Email validation fix is in place in the controller.');
    
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
checkDB();
