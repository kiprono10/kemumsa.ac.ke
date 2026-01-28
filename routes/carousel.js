const express = require('express');
const { Carousel } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../assets/uploads/carousel');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'carousel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// GET all active carousel images
router.get('/', async (req, res) => {
  try {
    const carouselImages = await Carousel.find({
      active: true
    }).sort({ displayOrder: 1 }).lean();

    res.json({
      success: true,
      images: carouselImages || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      images: []
    });
  }
});

// GET carousel images by type
router.get('/type/:type', async (req, res) => {
  try {
    const carouselImages = await Carousel.find({
      active: true,
      imageType: req.params.type
    }).sort({ displayOrder: 1 }).lean();

    res.json({
      success: true,
      images: carouselImages || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      images: []
    });
  }
});

// Admin: GET all carousel images (including inactive)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const carouselImages = await Carousel.find({}).sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      images: carouselImages || [],
      count: carouselImages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: POST new carousel image
router.post('/admin/add', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, imageType, displayOrder } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const newImage = new Carousel({
      title,
      description,
      imageUrl,
      imageType: imageType || 'event',
      displayOrder: displayOrder || 0,
      uploadedBy: req.user?.email || 'admin',
      active: true
    });

    await newImage.save();

    res.json({
      success: true,
      message: 'Carousel image added successfully',
      image: newImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: UPLOAD image file
router.post('/admin/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/assets/uploads/carousel/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: UPDATE carousel image
router.put('/admin/update/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, imageType, displayOrder, active } = req.body;

    const image = await Carousel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        imageUrl,
        imageType,
        displayOrder,
        active,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Carousel image not found'
      });
    }

    res.json({
      success: true,
      message: 'Carousel image updated successfully',
      image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: DELETE carousel image
router.delete('/admin/delete/:id', authenticateAdmin, async (req, res) => {
  try {
    const image = await Carousel.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Carousel image not found'
      });
    }

    res.json({
      success: true,
      message: 'Carousel image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: TOGGLE carousel image active status
router.patch('/admin/toggle/:id', authenticateAdmin, async (req, res) => {
  try {
    const image = await Carousel.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Carousel image not found'
      });
    }

    image.active = !image.active;
    await image.save();

    res.json({
      success: true,
      message: `Carousel image ${image.active ? 'activated' : 'deactivated'} successfully`,
      image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
