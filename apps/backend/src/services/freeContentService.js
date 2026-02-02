const { FreeContent } = require('../models');
const fs = require('fs');
const path = require('path');

class FreeContentService {
  async getAllContent(isAdmin = false) {
    const whereClause = isAdmin ? {} : { content_status: 'published' };
    
    return await FreeContent.findAll({
      where: whereClause,
      include: [{ model: require('../models').User, as: 'User', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
    });
  }

  async getContentById(id, isAdmin = false) {
    const whereClause = isAdmin ? { id } : { id, content_status: 'published' };
    
    return await FreeContent.findOne({
      where: whereClause,
      include: [{ model: require('../models').User, as: 'User', attributes: ['id', 'name', 'email'] }],
    });
  }

  async createContent(data, file, userId) {
    const { title, description, type, content_status = 'draft', content_blocks = [] } = data;
    
    // Simpan ke database
    return await FreeContent.create({
      title,
      description,
      type,
      created_by: userId,
      content_status,
      content_blocks,
    });
  }

  async updateContent(id, data, file = null) {
    const content = await FreeContent.findByPk(id);
    if (!content) {
      throw new Error('Konten tidak ditemukan');
    }

    const updates = { ...data };

    await content.update(updates);
    return content;
  }

  async deleteContent(id) {
    const content = await FreeContent.findByPk(id);
    if (!content) {
      throw new Error('Konten tidak ditemukan');
    }

    // Hapus dari database
    await content.destroy();
    return { message: 'Konten berhasil dihapus' };
  }
}

module.exports = new FreeContentService();