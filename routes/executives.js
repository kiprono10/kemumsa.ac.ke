const express = require('express');
const router = express.Router();
const { Executive } = require('../models');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/images/executives/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'executive-' + uniqueSuffix + path.extname(file.originalname));
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

// Get all executives
router.get('/', async (req, res) => {
    try {
        const executives = await Executive.findAll({ 
          where: { isActive: true },
          order: [['position', 'ASC']]
        });
        res.json({
            success: true,
            executives,
            count: executives.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single executive
router.get('/:id', async (req, res) => {
    try {
        const executive = await Executive.findByPk(req.params.id);
        if (!executive) {
            return res.status(404).json({
                success: false,
                message: 'Executive not found'
            });
        }
        res.json({
            success: true,
            executive
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create new executive
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { firstName, lastName, position, email, phone, yearOfStudy, imageUrl, facebook, twitter, instagram, linkedin, whatsapp } = req.body;

        // Convert yearOfStudy to number
        const yearOfStudyNum = yearOfStudy ? parseInt(yearOfStudy) : undefined;

        if (!firstName || !lastName || !position || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: firstName, lastName, position, email'
            });
        }

        const existingExecutive = await Executive.findOne({ where: { email: email.toLowerCase() } });
        if (existingExecutive) {
            return res.status(400).json({
                success: false,
                message: 'An executive with this email already exists'
            });
        }

        // Handle image upload or URL
        let finalImageUrl = imageUrl || '';
        if (req.file) {
            finalImageUrl = `/assets/images/executives/${req.file.filename}`;
        }

        const executive = await Executive.create({
            firstName,
            lastName,
            position,
            email,
            phone,
            yearOfStudy: yearOfStudyNum,
            imageUrl: finalImageUrl,
            socialMedia: {
                facebook: facebook || '',
                twitter: twitter || '',
                instagram: instagram || '',
                linkedin: linkedin || '',
                whatsapp: whatsapp || ''
            },
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: 'Executive created successfully',
            executive
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update executive
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { firstName, lastName, position, email, phone, yearOfStudy, isActive, imageUrl, facebook, twitter, instagram, linkedin, whatsapp } = req.body;

        const executive = await Executive.findByPk(req.params.id);
        if (!executive) {
            return res.status(404).json({
                success: false,
                message: 'Executive not found'
            });
        }

        if (email && email !== executive.email) {
            const existingExecutive = await Executive.findOne({ 
              where: { email: email.toLowerCase(), id: { [require('sequelize').Op.ne]: req.params.id } }
            });
            if (existingExecutive) {
                return res.status(400).json({
                    success: false,
                    message: 'An executive with this email already exists'
                });
            }
        }

        // Handle image upload or URL
        let finalImageUrl = executive.imageUrl; // Keep existing if no new image
        if (req.file) {
            finalImageUrl = `/assets/images/executives/${req.file.filename}`;
        } else if (imageUrl !== undefined) {
            finalImageUrl = imageUrl;
        }

        const updateData = {
          firstName: firstName || executive.firstName,
          lastName: lastName || executive.lastName,
          position: position || executive.position,
          email: email || executive.email,
          phone: phone || executive.phone,
          yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : executive.yearOfStudy,
          isActive: isActive !== undefined ? isActive : executive.isActive,
          imageUrl: finalImageUrl,
          socialMedia: {
            facebook: facebook || executive.socialMedia?.facebook,
            twitter: twitter || executive.socialMedia?.twitter,
            instagram: instagram || executive.socialMedia?.instagram,
            linkedin: linkedin || executive.socialMedia?.linkedin,
            whatsapp: whatsapp || executive.socialMedia?.whatsapp
          }
        };

        await executive.update(updateData);

        res.json({
            success: true,
            message: 'Executive updated successfully',
            executive
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete executive
router.delete('/:id', async (req, res) => {
    try {
        const executive = await Executive.findByPk(req.params.id);
        if (!executive) {
            return res.status(404).json({
                success: false,
                message: 'Executive not found'
            });
        }

        await executive.destroy();
        
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
