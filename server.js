const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const compression = require('compression');
require('dotenv').config();

// Import database models
const { sequelize, Member, Event, syncDatabase } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected successfully');
    // Sync database (create tables if they don't exist)
    return syncDatabase({ alter: false });
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err.message);
    console.log('Please make sure PostgreSQL is running and DATABASE_URL is configured');
  });

// Middleware
// app.use(helmet()); // Temporarily disabled
app.use(morgan('combined'));
app.use(compression()); // Add gzip compression
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Disable caching for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve static files from the root directory
app.use(express.static('.'));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Import routes
let memberRoutes, eventRoutes, adminRoutes, classLeaderRoutes, executiveRoutes, resourceRoutes;
try {
  memberRoutes = require('./routes/members');
  eventRoutes = require('./routes/events');
  adminRoutes = require('./routes/admin');
  classLeaderRoutes = require('./routes/class-leaders');
  executiveRoutes = require('./routes/executives');
  resourceRoutes = require('./routes/resources');
  console.log('Routes loaded successfully');
} catch (err) {
  console.error('Error loading routes:', err.message);
  console.error('Stack:', err.stack);
}

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KeMUMSA Backend is running' });
});

// Statistics endpoint for home page
app.get('/api/statistics', async (req, res) => {
  try {
    // Get counts from database using Sequelize
    const activeMembers = await Member.count({ where: { profileVisible: true } });
    const totalEvents = await Event.count({ where: { isActive: true } });
    const yearsEstablished = 14; // Static value - KeMUMSA founded in 2010
    
    // Calculate success stories (members who have been here for multiple years or completed events)
    const successStories = Math.floor(activeMembers * 0.1) || 5; // Estimate 10% of members have success stories
    
    res.json({
      success: true,
      statistics: {
        activeMembers: Math.max(activeMembers, 1),
        eventsThisYear: Math.max(totalEvents, 0),
        yearsEstablished: yearsEstablished,
        successStories: Math.max(successStories, 5)
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Fallback to minimal data if error
    res.json({
      success: true,
      statistics: {
        activeMembers: 1,
        eventsThisYear: 0,
        yearsEstablished: 14,
        successStories: 5
      }
    });
  }
});

// API routes (protected with authentication - TEMPORARILY DISABLED FOR TESTING)
// app.use('/api/members', authenticateToken, memberRoutes);
// app.use('/api/events', authenticateToken, eventRoutes);

// Temporary: Direct access without auth
if (memberRoutes) {
  app.use('/api/members', memberRoutes);
  console.log('Mounted /api/members route');
}
if (eventRoutes) {
  app.use('/api/events', eventRoutes);
  console.log('Mounted /api/events route');
}
if (adminRoutes) {
  app.use('/api/admin', adminRoutes);
  console.log('Mounted /api/admin route');
}
if (classLeaderRoutes) {
  app.use('/api/class-leaders', classLeaderRoutes);
  console.log('Mounted /api/class-leaders route');
} else {
  console.log('classLeaderRoutes is falsy, not mounting /api/class-leaders');
}
if (executiveRoutes) {
  app.use('/api/executives', executiveRoutes);
  console.log('Mounted /api/executives route');
  console.log('Executive routes object:', typeof executiveRoutes);
} else {
  console.log('executiveRoutes is falsy, not mounting /api/executives');
  console.log('Error loading executiveRoutes:', executiveRoutes);
}
if (resourceRoutes) {
  app.use('/api/resources', resourceRoutes);
  console.log('Mounted /api/resources route');
} else {
  console.log('resourceRoutes is falsy, not mounting /api/resources');
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  if (socket.writable) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }
});
