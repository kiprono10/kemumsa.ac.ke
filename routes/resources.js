const express = require('express');
const Resource = require('../models/Resource');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// GET all resources (public for members)
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET resources by year
router.get('/year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const resources = await Resource.find({ year: year, isActive: true }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET resources by type
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const resources = await Resource.find({ type: type, isActive: true }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new resource (admin only)
router.post('/', async (req, res) => {
  try {
    const resource = new Resource({
      title: req.body.title,
      type: req.body.type,
      year: req.body.year,
      subject: req.body.subject,
      description: req.body.description,
      fileUrl: req.body.fileUrl,
      date: req.body.date || new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update a resource (admin only)
router.put('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (req.body.title != null) resource.title = req.body.title;
    if (req.body.type != null) resource.type = req.body.type;
    if (req.body.year != null) resource.year = req.body.year;
    if (req.body.subject != null) resource.subject = req.body.subject;
    if (req.body.description != null) resource.description = req.body.description;
    if (req.body.fileUrl != null) resource.fileUrl = req.body.fileUrl;
    if (req.body.date != null) resource.date = req.body.date;
    if (req.body.isActive != null) resource.isActive = req.body.isActive;

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE a resource (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH toggle active status (admin only)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    resource.isActive = !resource.isActive;
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
