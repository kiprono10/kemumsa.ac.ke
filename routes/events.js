const express = require('express');
const { Event } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../assets/uploads/events');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/webm',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new event with file uploads
router.post('/', upload.array('media', 5), async (req, res) => {
  try {
    const media = req.files ? req.files.map(file => `/assets/uploads/events/${file.filename}`) : [];
    
    // Parse maxAttendees from form data if it exists
    let maxAttendees = null;
    if (req.body.maxAttendees && req.body.maxAttendees !== 'null' && req.body.maxAttendees !== '') {
      maxAttendees = parseInt(req.body.maxAttendees);
    }
    
    const newEvent = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      time: req.body.time || '',
      location: req.body.location || '',
      organizer: req.body.organizer || '',
      maxAttendees: maxAttendees,
      image: req.body.image || '',
      media: media
    });

    res.status(201).json(newEvent);
  } catch (error) {
    // Clean up uploaded files if save fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT update an event
router.put('/:id', upload.array('media', 5), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.update({
      title: req.body.title || event.title,
      description: req.body.description || event.description,
      date: req.body.date ? new Date(req.body.date) : event.date,
      time: req.body.time || event.time,
      location: req.body.location || event.location,
      organizer: req.body.organizer || event.organizer,
      image: req.body.image || event.image,
      isActive: req.body.isActive !== undefined ? req.body.isActive === 'true' : event.isActive,
      maxAttendees: req.body.maxAttendees && req.body.maxAttendees !== 'null' && req.body.maxAttendees !== '' 
        ? parseInt(req.body.maxAttendees) 
        : event.maxAttendees
    });

    // Add new media files if uploaded
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map(file => `/assets/uploads/events/${file.filename}`);
      const updatedMedia = [...(event.media || []), ...newMedia];
      await event.update({ media: updatedMedia });
    }

    const updatedEvent = await Event.findByPk(req.params.id);
    res.json(updatedEvent);
  } catch (error) {
    // Clean up uploaded files if save fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    console.error('Error updating event:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Clean up uploaded media files
    if (event.media && event.media.length > 0) {
      event.media.forEach(mediaPath => {
        const filePath = path.join(__dirname, '..', mediaPath);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    await event.destroy();
  }
});

module.exports = router;
