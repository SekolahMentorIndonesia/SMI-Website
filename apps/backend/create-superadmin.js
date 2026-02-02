const { User } = require('./src/models');

async function createSuperAdmin() {
  try {
    // Cek apakah superadmin sudah ada
    const existingSuperAdmin = await User.findOne({ where: { role: 'superadmin' } });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists:', existingSuperAdmin.email);
      return;
    }

    // Buat superadmin baru
    const superadmin = await User.create({
      name: 'Superadmin SMI',
      email: 'superadmin@smi.id',
      password: 'passwordsuperadmin',
      role: 'superadmin',
      status: 'approved'
    });

    console.log('Superadmin created successfully:');
    console.log('- Email:', superadmin.email);
    console.log('- Password:', 'passwordsuperadmin');
    console.log('- Role:', superadmin.role);

  } catch (error) {
    console.error('Error creating superadmin:', error.message);
  } finally {
    process.exit();
  }
}

createSuperAdmin();