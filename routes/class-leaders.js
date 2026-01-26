const express = require('express');
const router = express.Router();
const ClassLeader = require('../models/ClassLeader');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/images/classleaders/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'classleader-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all class leaders or filter by year
router.get('/', async (req, res) => {
    try {
        const { year, isActive } = req.query;
        let query = {};

        if (year) {
            query.yearOfStudy = parseInt(year);
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        } else {
            query.isActive = true; // Default: only show active leaders
        }

        // Use lean() for faster read-only queries
        const classLeaders = await ClassLeader.find(query).sort({ yearOfStudy: 1, firstName: 1 }).lean();

        res.json({
            success: true,
            classLeaders,
            count: classLeaders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single class leader
router.get('/:id', async (req, res) => {
    try {
        const classLeader = await ClassLeader.findById(req.params.id);

        if (!classLeader) {
            return res.status(404).json({
                success: false,
                message: 'Class leader not found'
            });
        }

        res.json({
            success: true,
            classLeader
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create new class leader
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { firstName, lastName, position, yearOfStudy, email, phone, bio, imageUrl, socialAccounts, isActive } = req.body;
        
        // Determine image path - use uploaded file if present, otherwise use imageUrl
        let imagePath = imageUrl;
        if (req.file) {
            imagePath = req.file.path;
        }

        // Validation
        if (!firstName || !lastName || !position || !yearOfStudy || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: firstName, lastName, position, yearOfStudy, email'
            });
        }

        // Check if email already exists
        const existingLeader = await ClassLeader.findOne({ email: email.toLowerCase() });
        if (existingLeader) {
            return res.status(400).json({
                success: false,
                message: 'A class leader with this email already exists'
            });
        }

        const classLeader = new ClassLeader({
            firstName,
            lastName,
            position,
            yearOfStudy,
            email,
            phone,
            bio,
            imageUrl: imagePath,
            socialAccounts,
            isActive: isActive !== undefined ? isActive : true
        });

        await classLeader.save();

        res.status(201).json({
            success: true,
            message: 'Class leader created successfully',
            classLeader
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update class leader
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { firstName, lastName, position, yearOfStudy, email, phone, bio, imageUrl, socialAccounts, isActive } = req.body;
        
        // Determine image path - use uploaded file if present, otherwise use imageUrl
        let imagePath = imageUrl;
        if (req.file) {
            imagePath = req.file.path;
        }

        const classLeader = await ClassLeader.findById(req.params.id);

        if (!classLeader) {
            return res.status(404).json({
                success: false,
                message: 'Class leader not found'
            });
        }

        // Check if new email is already used by another leader
        if (email && email !== classLeader.email) {
            const existingLeader = await ClassLeader.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
            if (existingLeader) {
                return res.status(400).json({
                    success: false,
                    message: 'A class leader with this email already exists'
                });
            }
        }

        // Update fields
        if (firstName) classLeader.firstName = firstName;
        if (lastName) classLeader.lastName = lastName;
        if (position) classLeader.position = position;
        if (yearOfStudy) classLeader.yearOfStudy = yearOfStudy;
        if (email) classLeader.email = email;
        if (phone) classLeader.phone = phone;
        if (bio !== undefined) classLeader.bio = bio;
        if (imagePath !== undefined) classLeader.imageUrl = imagePath;
        if (socialAccounts !== undefined) classLeader.socialAccounts = socialAccounts;
        if (isActive !== undefined) classLeader.isActive = isActive;

        await classLeader.save();

        res.json({
            success: true,
            message: 'Class leader updated successfully',
            classLeader
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete class leader
router.delete('/:id', async (req, res) => {
    try {
        const classLeader = await ClassLeader.findByIdAndDelete(req.params.id);

        if (!classLeader) {
            return res.status(404).json({
                success: false,
                message: 'Class leader not found'
            });
        }

        res.json({
            success: true,
            message: 'Class leader deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get class leaders by year with count
router.get('/stats/by-year', async (req, res) => {
    try {
        const stats = await ClassLeader.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$yearOfStudy', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
