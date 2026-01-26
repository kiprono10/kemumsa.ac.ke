# PostgreSQL Migration Guide

## Overview
This document outlines the complete migration from MongoDB (Mongoose) to PostgreSQL (Sequelize) for the KEMUMSA website.

## Migration Status: ✅ COMPLETE

### Changes Made

#### 1. Database Technology
- **OLD**: MongoDB with Mongoose ODM
- **NEW**: PostgreSQL with Sequelize ORM
- **Deployment**: Render.com with managed PostgreSQL

#### 2. Dependencies Updated (package.json)
```bash
# Removed
mongoose ^9.1.5

# Added
sequelize ^6.35.2
pg ^8.11.3
pg-hstore ^2.3.4
```

#### 3. Data Models Converted (8 models)
All models in `/models/` directory have been converted with:
- **Primary Keys**: MongoDB ObjectIds → PostgreSQL UUIDs
- **Timestamps**: Automatic `createdAt` and `updatedAt`
- **Complex Objects**: Mongoose arrays/objects → JSON columns
- **Enums**: String enums → PostgreSQL ENUM type
- **Indexes**: Strategic indexes for performance

**Converted Models:**
1. ✅ `Member.js` - User accounts with interests (JSON), profile visibility
2. ✅ `Event.js` - Event management with media array (JSON)
3. ✅ `Executive.js` - Executive profiles with social media (JSON)
4. ✅ `ClassLeader.js` - Class representatives with social accounts (JSON)
5. ✅ `Resource.js` - Academic resources (exams, notes, CATs)
6. ✅ `Message.js` - Admin messages with categories and status
7. ✅ `Communication.js` - Organization contact information
8. ✅ `Admin.js` - Admin user management

#### 4. Route Files Converted (6 files)
All API endpoints updated to use Sequelize syntax:

**Conversion Pattern:**
```javascript
// OLD (Mongoose)
const member = await Member.findById(id);
const members = await Member.find({ status: 'active' }).lean();
await Member.findByIdAndDelete(id);
const newMember = new Member({...}); await newMember.save();

// NEW (Sequelize)
const member = await Member.findByPk(id);
const members = await Member.findAll({ where: { status: 'active' }, raw: true });
await Member.destroy({ where: { id } });
const newMember = await Member.create({...});
```

**Updated Routes:**
- ✅ `routes/members.js` - Member CRUD & authentication
- ✅ `routes/events.js` - Event management with media uploads
- ✅ `routes/executives.js` - Executive administration
- ✅ `routes/class-leaders.js` - Class leader management
- ✅ `routes/resources.js` - Academic resource sharing
- ✅ `routes/admin.js` - Admin dashboard, messages, communication settings

#### 5. Server Configuration (server.js)
Updated initialization:
```javascript
// Database connection
const { sequelize, Member, Event, syncDatabase } = require('./models');

// Automatic table creation on startup
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected successfully');
    return syncDatabase({ alter: false });
  });
```

#### 6. Environment Configuration (.env.example)
Created documentation for PostgreSQL setup:
```
# Local Development
DATABASE_URL=postgres://username:password@localhost:5432/kemumsa

# Render.com
DATABASE_URL=postgresql://user:password@host:5432/database

# Production
DATABASE_URL=postgresql://prod_user:prod_password@prod_host:5432/prod_db
```

#### 7. Deployment Configuration (render.yaml)
Updated for PostgreSQL hosting on Render.com

### Database Schema Changes

#### Field Type Mappings
- `ObjectId` → `UUID` (primary key)
- `String` → `VARCHAR`
- `Number` → `INTEGER`
- `Boolean` → `BOOLEAN`
- `Date` → `TIMESTAMP`
- `Array/Object` → `JSON`
- `String enums` → `ENUM`

#### New Features
- **Automatic Timestamps**: All tables include `createdAt` and `updatedAt`
- **JSON Support**: Complex nested objects stored efficiently
- **ENUM Constraints**: Status/category fields validated at database level
- **Strategic Indexes**: Optimized queries on frequently searched fields

### Query Method Changes

| Mongoose | Sequelize | Purpose |
|----------|-----------|---------|
| `find()` | `findAll()` | Get multiple records |
| `findOne()` | `findOne({ where: {...} })` | Get single record |
| `findById()` | `findByPk()` | Get by primary key |
| `findByIdAndDelete()` | `destroy({ where: { id } })` | Delete record |
| `.lean()` | `raw: true` | Return plain objects |
| `countDocuments()` | `count()` | Count records |
| `new Model()` | `Model.create()` | Create record |
| `model.save()` | `model.update()` | Update record |
| `.aggregate()` | `findAll()` with group | Aggregation queries |

### Deployment Steps

#### Local Testing
```bash
# 1. Install dependencies
npm install

# 2. Setup PostgreSQL locally
createdb kemumsa

# 3. Configure .env
DATABASE_URL=postgres://username:password@localhost:5432/kemumsa
JWT_SECRET=your-secret-key

# 4. Start server
npm start

# 5. Test endpoints
curl http://localhost:3000/api/members
```

#### Render.com Deployment
1. **Create PostgreSQL Database** on Render
2. **Configure Environment Variables**:
   - `DATABASE_URL` (auto-provided by Render)
   - `JWT_SECRET` (set your own)
3. **Deploy** - Tables created automatically on first startup
4. **Verify** - Check logs for "PostgreSQL connected successfully"

### Validation Checklist

- ✅ All 8 models converted to Sequelize
- ✅ All 6 route files updated with Sequelize queries
- ✅ No MongoDB references remaining in production code
- ✅ Environment configuration documented
- ✅ Database initialization logic implemented
- ✅ Deployment configuration updated
- ✅ Changes committed to GitHub

### Breaking Changes

⚠️ **Important**: All code now requires PostgreSQL. MongoDB will no longer work.

**If reverting needed**: Checkout commit `1152f40` (last Mongoose version)

### Performance Notes

PostgreSQL advantages over MongoDB:
- ✅ Better for relational data (members, events, relationships)
- ✅ ENUM constraints prevent invalid data
- ✅ Efficient JSON column support
- ✅ Standard SQL for complex queries
- ✅ Better scalability for production

### Troubleshooting

**Error: "Cannot find module 'mongoose'"**
- ✅ Expected - mongoose dependency removed
- Run: `npm install` to get Sequelize

**Error: "PostgreSQL connection failed"**
- Check DATABASE_URL environment variable
- Verify PostgreSQL is running
- Confirm database exists

**Error: "Table doesn't exist"**
- Tables created automatically on startup
- Check server logs for "PostgreSQL connected successfully"
- Run migration: `node_modules/.bin/sequelize db:migrate`

### Next Steps

1. **Testing**: Run comprehensive API tests with PostgreSQL
2. **Performance Monitoring**: Track query performance in production
3. **Backups**: Setup regular PostgreSQL database backups
4. **Documentation**: Update API documentation with PostgreSQL specifics
5. **CI/CD**: Update deployment pipeline for PostgreSQL

### Support

For database issues:
- Check Sequelize documentation: https://sequelize.org/
- Verify PostgreSQL connection: `psql -l`
- Review server logs for specific errors

---

**Migration Completed**: Commit `9442672`
**Last Update**: $(date)
