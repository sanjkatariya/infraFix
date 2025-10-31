# InfraFix API Setup Guide

## 🚀 Quick Start

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Start the API Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

### 3. Test the API

Open your browser or use curl:
```bash
curl http://localhost:3000/api/health
```

## 📋 API Endpoints Overview

### **Complaints** (`/api/complaints`)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get all complaints (with filters)
- `GET /api/complaints/:id` - Get complaint by ID
- `PATCH /api/complaints/:id` - Update complaint
- `PATCH /api/complaints/:id/status` - Update status
- `DELETE /api/complaints/:id` - Delete complaint
- `GET /api/complaints/user/:userId` - Get user's complaints

### **Workorders** (`/api/workorders`)
- `POST /api/workorders` - Create workorder from complaint
- `GET /api/workorders` - Get all workorders
- `GET /api/workorders/:id` - Get workorder by ID
- `PATCH /api/workorders/:id` - Update workorder
- `PATCH /api/workorders/:id/status` - Update status
- `DELETE /api/workorders/:id` - Delete workorder

### **Crew** (`/api/crew`)
- `POST /api/crew` - Add crew member
- `GET /api/crew` - Get all crew
- `GET /api/crew/:id` - Get crew member by ID
- `PATCH /api/crew/:id` - Update crew member
- `GET /api/crew/available/list` - Get available crew

### **Inventory** (`/api/inventory`)
- `POST /api/inventory` - Add inventory item
- `GET /api/inventory` - Get all items
- `PATCH /api/inventory/:id/stock` - Update stock levels
- `GET /api/inventory/category/:category` - Get by category

### **Resources** (`/api/resources`)
- `POST /api/resources` - Add resource (vehicles, equipment)
- `GET /api/resources` - Get all resources
- `PATCH /api/resources/:id/assign` - Assign to workorder
- `PATCH /api/resources/:id/release` - Release resource

### **Status** (`/api/status`)
- `GET /api/status/complaint/:id` - Get complaint status
- `GET /api/status/workorder/:id` - Get workorder status
- `GET /api/status/overview` - Get system overview

### **Analytics** (`/api/analytics`)
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/stats` - General statistics
- `GET /api/analytics/trends` - Trend data

## 💾 Database

Currently uses **in-memory storage** for development. Data is lost on server restart.

### Sample Data Structure

**Complaint:**
```json
{
  "id": "CPL-12345",
  "userId": "user1",
  "category": "pothole",
  "description": "Large pothole on Main St",
  "location": "Main St & 5th Ave",
  "coordinates": "40.7128,-74.0060",
  "status": "pending",
  "progress": 0,
  "priority": 8,
  "createdAt": "2025-01-31T12:00:00.000Z"
}
```

**Workorder:**
```json
{
  "id": "WO-12345",
  "complaintId": "CPL-12345",
  "title": "Fix pothole on Main St",
  "status": "in-progress",
  "progress": 60,
  "assignedCrew": ["CREW-1", "CREW-2"],
  "estimatedCost": 1500,
  "startDate": "2025-01-31T12:00:00.000Z"
}
```

## 🔄 Example Workflow

1. **Citizen files complaint:**
   ```bash
   POST /api/complaints
   {
     "category": "pothole",
     "description": "Large pothole",
     "location": "Main St",
     "phone": "123-456-7890"
   }
   ```

2. **Admin creates workorder:**
   ```bash
   POST /api/workorders
   {
     "complaintId": "CPL-12345",
     "title": "Fix pothole",
     "assignedCrew": ["CREW-1"],
     "estimatedCost": 1500
   }
   ```

3. **Update workorder status:**
   ```bash
   PATCH /api/workorders/WO-12345/status
   {
     "status": "in-progress",
     "progress": 50
   }
   ```

4. **Track status:**
   ```bash
   GET /api/status/complaint/CPL-12345
   ```

## 🔧 Frontend Integration

The frontend API client is already configured in `src/lib/api.ts`. Set the API URL:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Or it defaults to `http://localhost:3000/api`

## 🚀 Next Steps

1. **Connect to Real Database:**
   - Replace `server/database/db.js` with MongoDB, PostgreSQL, or MySQL
   - Use Mongoose, Sequelize, or Prisma

2. **Add Authentication:**
   - Implement JWT token generation
   - Add password hashing
   - Protect routes with middleware

3. **Add File Upload:**
   - Configure multer for image uploads
   - Store images in cloud storage (S3, Cloudinary)

4. **Add Validation:**
   - Use express-validator or Joi
   - Validate request bodies

5. **Add Error Handling:**
   - Better error messages
   - Logging (Winston, Morgan)

## 📝 Notes

- All endpoints return JSON
- Use proper HTTP status codes
- Include error messages in responses
- CORS is enabled for all origins (configure in production)

## 🐛 Troubleshooting

**Port 3000 already in use:**
- Change `PORT` in `.env` or environment variable
- Or kill process: `npx kill-port 3000`

**Cannot connect from frontend:**
- Ensure server is running
- Check CORS configuration
- Verify API URL in frontend `.env`

---

For detailed API documentation, see `server/README.md`

