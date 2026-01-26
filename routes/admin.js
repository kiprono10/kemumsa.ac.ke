const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const Message = require('../models/Message');
const Member = require('../models/Member');
const Admin = require('../models/Admin');

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Demo admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = `admin-token-${Date.now()}`;
      
      res.json({
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get communication settings
router.get('/communication', async (req, res) => {
  try {
    let communication = await Communication.findOne();
    
    if (!communication) {
      // Return default communication settings if none exist
      communication = {
        email: 'kemumsa@kemu.ac.ke',
        phone: '+254712345678',
        office: {
          building: 'Student Center',
          room: 'Room 205',
          location: 'Kenya Methodist University'
        },
        officeHours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 2:00 PM',
          sunday: 'Closed'
        },
        responseTime: 'Within 24 hours',
        address: {
          street: 'Student Center, Room 205',
          city: 'Meru',
          state: 'Kenya',
          country: 'Kenya'
        }
      };
    }
    
    res.json(communication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update communication settings
router.post('/communication', async (req, res) => {
  try {
    const { email, phone, office, officeHours, responseTime, address, socialMedia, additionalInfo } = req.body;
    
    // Optional token verification (for now, accept all requests)
    // const token = req.headers['x-admin-token'];
    // if (!token) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }

    let communication = await Communication.findOne();
    
    if (!communication) {
      // Create new communication document
      communication = new Communication({
        email,
        phone,
        office,
        officeHours,
        responseTime,
        address,
        socialMedia,
        additionalInfo
      });
    } else {
      // Update existing communication document
      if (email) communication.email = email;
      if (phone) communication.phone = phone;
      if (office) communication.office = office;
      if (officeHours) communication.officeHours = officeHours;
      if (responseTime) communication.responseTime = responseTime;
      if (address) communication.address = address;
      if (socialMedia) communication.socialMedia = socialMedia;
      if (additionalInfo) communication.additionalInfo = additionalInfo;
    }
    
    await communication.save();
    res.json({ success: true, message: 'Communication settings updated', communication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all messages (inbox and viewed)
router.get('/messages', async (req, res) => {
  try {
    const folder = req.query.folder || 'inbox';
    
    const messages = await Message.find({
      folder: folder,
      isDeleted: false
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      folder,
      messages,
      total: messages.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single message
router.get('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Mark as viewed
    if (message.status === 'new') {
      message.status = 'viewed';
      message.folder = 'viewed';
      message.viewedAt = Date.now();
      await message.save();
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reply to message
router.post('/messages/:id/reply', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { replyMessage } = req.body;
    
    if (!replyMessage) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.adminReply = {
      message: replyMessage,
      repliedAt: Date.now(),
      repliedBy: 'Admin'
    };
    message.status = 'replied';
    message.folder = 'viewed';
    
    await message.save();
    
    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete message (only from viewed folder)
router.delete('/messages/:id', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only allow deletion from viewed folder
    if (message.folder !== 'viewed') {
      return res.status(403).json({ message: 'Can only delete messages from viewed folder' });
    }

    message.isDeleted = true;
    message.deletedAt = Date.now();
    await message.save();
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Move message to viewed
router.post('/messages/:id/mark-viewed', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.status = 'viewed';
    message.folder = 'viewed';
    message.viewedAt = Date.now();
    await message.save();
    
    res.json({
      success: true,
      message: 'Message marked as viewed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit contact form message
router.post('/messages/submit', async (req, res) => {
  try {
    const { sender, subject, message, category, newsletter } = req.body;
    
    if (!sender || !subject || !message) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const newMessage = new Message({
      sender,
      subject,
      message,
      category: category || 'general',
      newsletter,
      status: 'new',
      folder: 'inbox'
    });

    await newMessage.save();

    res.json({
      success: true,
      message: 'Message submitted successfully',
      messageId: newMessage._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin profile
router.get('/profile', async (req, res) => {
  try {
    let admin = await Admin.findOne();

    if (!admin) {
      // Return default admin if none exists
      return res.json({
        username: 'admin',
        email: 'admin@kemumsa.org',
        role: 'admin'
      });
    }

    res.json({
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin profile
router.post('/profile/update', async (req, res) => {
  try {
    const { username, newUsername, currentPassword, newPassword, confirmPassword } = req.body;
    const token = req.headers['x-admin-token'];

    // Validate token
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if new password matches confirm password (if provided)
    if (newPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New passwords do not match' 
      });
    }

    // Check minimum password length
    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 8 characters long' 
      });
    }

    let admin = await Admin.findOne();

    // If no admin exists, create one from current hardcoded credentials
    if (!admin) {
      admin = await Admin.create({
        username: 'admin',
        password: 'admin123',
        email: 'admin@kemumsa.org',
        role: 'admin'
      });
    }

    // Verify current password
    if (admin.password !== currentPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update username if provided
    if (newUsername && newUsername.trim()) {
      const existingAdmin = await Admin.findOne({ username: newUsername });
      if (existingAdmin && existingAdmin._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already taken' 
        });
      }
      admin.username = newUsername;
    }

    // Update password if provided
    if (newPassword) {
      admin.password = newPassword;
    }

    admin.updatedAt = new Date();
    await admin.save();

    res.json({
      success: true,
      message: 'Admin profile updated successfully',
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Verify admin password (for validation before making changes)
router.post('/verify-password', async (req, res) => {
  try {
    const { password } = req.body;

    let admin = await Admin.findOne();
    
    // If no admin exists, use hardcoded credentials
    if (!admin) {
      const isValid = password === 'admin123';
      return res.json({ valid: isValid });
    }

    const isValid = admin.password === password;
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

