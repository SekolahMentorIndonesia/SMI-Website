const freeContentService = require('../services/freeContentService');

class FreeContentController {
  async getAllContent(req, res) {
    try {
      const content = await freeContentService.getAllContent(false);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContentById(req, res) {
    try {
      const content = await freeContentService.getContentById(req.params.id, false);
      if (!content) {
        return res.status(404).json({ error: 'Konten tidak ditemukan' });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createContent(req, res) {
    try {
      // Role validation
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat membuat konten.' });
      }
      
      const content = await freeContentService.createContent(
        req.body,
        req.file,
        req.user.id
      );
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateContent(req, res) {
    try {
      // Role validation
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat mengubah konten.' });
      }

      const content = await freeContentService.updateContent(
        req.params.id,
        req.body,
        req.file
      );
      res.json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteContent(req, res) {
    try {
      // Role validation
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
        return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat menghapus konten.' });
      }

      const result = await freeContentService.deleteContent(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new FreeContentController();