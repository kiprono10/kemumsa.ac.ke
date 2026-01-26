const express = require('express');
const { Member } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// POST member login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const member = await Member.findOne({ where: { email } });
    if (!member) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Verify password - compare with stored password
    if (member.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if member is approved
    if (!member.profileVisible) {
      return res.status(403).json({
        success: false,
        message: 'Your membership is pending admin approval. Please wait for approval before accessing the dashboard.'
      });
    }

    const token = `member-token-${member.id}-${Date.now()}`;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        yearOfStudy: member.yearOfStudy,
        department: member.department
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET all members (public profiles only for directory)
router.get('/', async (req, res) => {
  try {
    // Single optimized query - only fetch visible members with needed fields
    const members = await Member.findAll({
      where: { profileVisible: true, isActive: true },
      attributes: ['id', 'firstName', 'lastName', 'email', 'yearOfStudy', 'department', 'status', 'interests', 'profilePicture', 'profileVisible'],
      raw: true
    });

    // Get count of all active members (for stats)
    const totalMembers = await Member.count({ where: { isActive: true } });
    
    // Calculate stats from the members array we already have
    const visibleMembers = members.length;
    const activeNowCount = members.filter(m => m.status === 'online').length;
    const yearsSet = new Set(members.map(m => m.yearOfStudy).filter(year => year));
    const yearsCount = yearsSet.size || 6;

    // Ensure all stats are valid numbers
    const stats = {
      totalMembers: parseInt(totalMembers) || 0,
      visibleMembers: parseInt(visibleMembers) || 0,
      activeNow: parseInt(activeNowCount) || 0,
      memberYears: parseInt(yearsCount) || 6
    };

    res.json({
      members,
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      members: [],
      stats: {
        totalMembers: 0,
        visibleMembers: 0,
        activeNow: 0,
        memberYears: 6
      }
    });
  }
});

// GET all members for admin (including pending approvals)
router.get('/admin/all', async (req, res) => {
  try {
    // Single optimized query for admin
    const members = await Member.findAll({
      where: { isActive: true },
      raw: true
    });
    
    const totalMembers = members.length;
    const approvedMembers = members.filter(m => m.profileVisible).length;
    const pendingMembers = members.filter(m => !m.profileVisible).length;
    const activeMembers = members.filter(m => m.isActive).length;

    res.json({
      members,
      stats: {
        totalMembers,
        approvedMembers,
        pendingMembers,
        activeMembers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new member
router.post('/', async (req, res) => {
  try {
    // Validate email domain
    const { email } = req.body;
    const emailDomainRegex = /^[^\s@]+@stu\.kemu\.ac\.ke$/;
    
    if (!emailDomainRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Email must be from KEMU student domain (@stu.kemu.ac.ke). Example: geinstein0411@stu.kemu.ac.ke' 
      });
    }

    // Check if email already exists
    const existingMember = await Member.findOne({ where: { email } });
    if (existingMember) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered. Please login or use a different email.' 
      });
    }

    const newMember = await Member.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      yearOfStudy: req.body.yearOfStudy,
      department: req.body.department,
      studentId: req.body.studentId,
      password: req.body.password,
      profilePicture: req.body.profilePicture,
      profileVisible: false, // Set to false for pending approval
      newsletter: req.body.newsletter || false,
      interests: req.body.interests || [],
      status: req.body.status || 'offline',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      token: `member-token-${newMember.id}-${Date.now()}`,
      user: {
        id: newMember.id,
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        email: newMember.email,
        phone: newMember.phone,
        yearOfStudy: newMember.yearOfStudy,
        department: newMember.department,
        studentId: newMember.studentId
      }
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// PUT update a member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Update only provided fields
    await member.update(req.body);
    
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify password for profile updates
router.post('/verify-password', async (req, res) => {
  try {
    const { memberId, password } = req.body;
    
    if (!memberId || !password) {
      return res.status(400).json({ success: false, message: 'Member ID and password are required' });
    }

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Verify password
    if (member.password !== password) {
      return res.status(401).json({ success: false, message: 'Password is incorrect' });
    }

    res.json({ success: true, message: 'Password verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE a member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    
    await member.destroy();
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
