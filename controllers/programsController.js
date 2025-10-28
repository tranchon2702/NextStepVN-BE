const { Program } = require('../models');

class ProgramsController {
  async list(req, res) {
    try {
      const programs = await Program.find({}).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: programs });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching programs', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
      res.status(200).json({ success: true, data: program });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching program', error: error.message });
    }
  }

  async getBySlug(req, res) {
    try {
      const program = await Program.findOne({ slug: req.params.slug, isActive: true });
      if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
      res.status(200).json({ success: true, data: program });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching program by slug', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { title, slug, excerpt, thumbnail, content, sections, faq, attachments, seoMeta, isActive } = req.body;
      const program = new Program({
        title,
        slug,
        excerpt: excerpt || '',
        thumbnail: thumbnail || '',
        content: content || '',
        sections: Array.isArray(sections) ? sections : [],
        faq: Array.isArray(faq) ? faq : [],
        attachments: Array.isArray(attachments) ? attachments : [],
        seoMeta: seoMeta || {},
        isActive: isActive !== undefined ? isActive : true
      });
      await program.save();
      res.status(201).json({ success: true, message: 'Program created', data: program });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating program', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const program = await Program.findByIdAndUpdate(id, payload, { new: true });
      if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
      res.status(200).json({ success: true, message: 'Program updated', data: program });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating program', error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const program = await Program.findByIdAndDelete(id);
      if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
      res.status(200).json({ success: true, message: 'Program deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting program', error: error.message });
    }
  }
}

module.exports = { ProgramsController: new ProgramsController() };


