const express = require('express');
const { Resource } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// GET all resources (public for members)
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.findAll({ 
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET resources by year
router.get('/year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const resources = await Resource.findAll({ 
      where: { year, isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET resources by type
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const resources = await Resource.findAll({ 
      where: { type, isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new resource (admin only)
router.post('/', async (req, res) => {
  try {
    const newResource = await Resource.create({
      title: req.body.title,
      type: req.body.type,
      year: req.body.year,
      subject: req.body.subject,
      description: req.body.description,
      fileUrl: req.body.fileUrl,
      date: req.body.date || new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update a resource (admin only)
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const updateData = {
      title: req.body.title || resource.title,
      type: req.body.type || resource.type,
      year: req.body.year || resource.year,
      subject: req.body.subject || resource.subject,
      description: req.body.description || resource.description,
      fileUrl: req.body.fileUrl || resource.fileUrl,
      date: req.body.date || resource.date,
      isActive: req.body.isActive !== undefined ? req.body.isActive : resource.isActive
    };

    await resource.update(updateData);
    const updatedResource = await Resource.findByPk(req.params.id);
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE a resource (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    await resource.destroy();
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH toggle active status (admin only)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    await resource.update({ isActive: !resource.isActive });
    const updatedResource = await Resource.findByPk(req.params.id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
