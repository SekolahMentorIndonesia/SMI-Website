const { FreeContent } = require('../models');
const fs = require('fs');
const path = require('path');

class FreeContentService {
  async getAllContent() {
    return await FreeContent.findAll({
      include: [{ model: require('../models').User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async getContentById(id) {
    return await FreeContent.findByPk(id, {
      include: [{ model: require('../models').User, attributes: ['id', 'name', 'email'] }],
    });
  }

  async createContent(data, file, userId) {
    const { title, description, type } = data;
    
    // Validasi file
    const allowedTypes = {
      blog: ['text/plain', 'text/markdown', 'application/pdf'],
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
      ebook: ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'],
    };

    if (!allowedTypes[type].includes(file.mimetype)) {
      throw new Error('Tipe file tidak diizinkan');
    }

    // Validasi ukuran file (maks 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Ukuran file terlalu besar (maks 50MB)');
    }

    // Simpan ke database - file sudah disimpan oleh multer
    return await FreeContent.create({
      title,
      description,
      type,
      file_path: file.path,
      file_name: file.filename,
      file_size: file.size,
      created_by: userId,
    });
  }

  async updateContent(id, data, file = null) {
    const content = await FreeContent.findByPk(id);
    if (!content) {
      throw new Error('Konten tidak ditemukan');
    }

    const updates = { ...data };

    if (file) {
      // Hapus file lama
      await fs.promises.unlink(content.file_path);

      // Validasi file baru
      const allowedTypes = {
        blog: ['text/plain', 'text/markdown', 'application/pdf'],
        video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
        ebook: ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'],
      };

      if (!allowedTypes[data.type || content.type].includes(file.mimetype)) {
        throw new Error('Tipe file tidak diizinkan');
      }

      // Validasi ukuran file (maks 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Ukuran file terlalu besar (maks 50MB)');
      }

      // File baru sudah disimpan oleh multer
      updates.file_path = file.path;
      updates.file_name = file.filename;
      updates.file_size = file.size;
    }

    await content.update(updates);
    return content;
  }

  async deleteContent(id) {
    const content = await FreeContent.findByPk(id);
    if (!content) {
      throw new Error('Konten tidak ditemukan');
    }

    // Hapus file
    await fs.promises.unlink(content.file_path);

    // Hapus dari database
    await content.destroy();
    return { message: 'Konten berhasil dihapus' };
  }
}

module.exports = new FreeContentService();