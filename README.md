# KEMUMSA Website 2.0

A comprehensive web application for the Kenya Medicines and Medical Supplies Authority (KEMUMSA) organization management system.

## 🚀 Features

- **Member Management**: View and manage member profiles with visibility controls
- **Class Leaders**: Organize members by academic year with designated class leaders
- **Events Management**: Create, update, and manage organizational events
- **Executive Management**: Track executive committee members
- **Admin Dashboard**: Centralized admin panel for content management
- **Real-time Communication**: Message system for admin communication
- **Resource Management**: Organize and share academic resources
- **Secure Authentication**: JWT-based authentication system

## 📋 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, JWT, CORS
- **Performance**: Gzip compression, database indexing, optimized queries

## 🔧 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kemumsa-website-2.0.git
cd kemumsa-website-2.0
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kemumsa
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. **Start the server**
```bash
npm start
```

For development with hot-reload:
```bash
npm run dev
```

5. **Access the application**
- Open browser and navigate to `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin.html`

## 📁 Project Structure

```
├── models/              # Database schemas
│   ├── Member.js
│   ├── Event.js
│   ├── Executive.js
│   ├── ClassLeader.js
│   └── ...
├── routes/              # API endpoints
│   ├── members.js
│   ├── events.js
│   ├── admin.js
│   └── ...
├── middleware/          # Custom middleware
│   └── auth.js
├── assets/              # Static files
│   ├── css/
│   ├── js/
│   └── images/
├── uploads/             # User uploads
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment config (not in repo)
```

## 🔐 API Endpoints

### Public Endpoints
- `GET /api/members` - Get all public members
- `GET /api/class-leaders` - Get all class leaders
- `GET /api/events` - Get all events
- `GET /api/executives` - Get executive committee members
- `GET /api/resources` - Get learning resources

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/members/admin/all` - Get all members (admin)
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

## 🚀 Performance Optimizations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Field projection and `.lean()` for read-only queries
- **Response Compression**: Gzip compression on all responses
- **Parallel Loading**: Frontend uses Promise.all() for concurrent API calls
- **Connection Pooling**: MongoDB maxPoolSize configured

## 📊 Testing Status

All critical components have been tested and verified:
- ✓ Server startup and initialization
- ✓ MongoDB connectivity
- ✓ All API endpoints
- ✓ Static file serving
- ✓ Authentication middleware
- ✓ Database operations

## 🔒 Security Features

- JWT authentication for admin operations
- CORS configuration
- Helmet.js for security headers
- Input validation
- Environment variable protection

## 📝 Development Guidelines

1. Always run tests before pushing changes
2. Keep database queries optimized
3. Follow the existing code structure
4. Update documentation for new features
5. Use meaningful commit messages

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0
