const { MentorPackage } = require('../models');

// Mengambil daftar semua paket mentoring yang aktif
const getPackages = async (req, res) => {
  try {
    const packages = await MentorPackage.findAll({
      where: { is_active: true }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPackages };
