# InfraFix API Server

Backend API server for the InfraFix citizen complaint management system.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server:**
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Complaints
- `GET /api/complaints` - Get all complaints (query: `status`, `category`, `userId`)
- `GET /api/complaints/:id` - Get complaint by ID
- `POST /api/complaints` - Create new complaint
- `PATCH /api/complaints/:id` - Update complaint
- `PATCH /api/complaints/:id/status` - Update complaint status
- `DELETE /api/complaints/:id` - Delete complaint
- `GET /api/complaints/user/:userId` - Get complaints by user

### Workorders
- `GET /api/workorders` - Get all workorders (query: `status`, `crewId`, `complaintId`)
- `GET /api/workorders/:id` - Get workorder by ID
- `POST /api/workorders` - Create new workorder
- `PATCH /api/workorders/:id` - Update workorder
- `PATCH /api/workorders/:id/status` - Update workorder status
- `DELETE /api/workorders/:id` - Delete workorder
- `GET /api/workorders/complaint/:complaintId` - Get workorders by complaint

### Crew
- `GET /api/crew` - Get all crew members (query: `status`, `skill`)
- `GET /api/crew/:id` - Get crew member by ID
- `POST /api/crew` - Create new crew member
- `PATCH /api/crew/:id` - Update crew member
- `PATCH /api/crew/:id/status` - Update crew member status
- `DELETE /api/crew/:id` - Delete crew member
- `GET /api/crew/available/list` - Get available crew members

### Inventory
- `GET /api/inventory` - Get all inventory items (query: `category`, `lowStock`)
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory` - Create new inventory item
- `PATCH /api/inventory/:id` - Update inventory item
- `PATCH /api/inventory/:id/stock` - Update inventory stock (body: `quantity`, `action`)
- `DELETE /api/inventory/:id` - Delete inventory item
- `GET /api/inventory/category/:category` - Get items by category

### Resources
- `GET /api/resources` - Get all resources (query: `type`, `status`)
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create new resource
- `PATCH /api/resources/:id` - Update resource
- `PATCH /api/resources/:id/assign` - Assign resource
- `PATCH /api/resources/:id/release` - Release resource
- `DELETE /api/resources/:id` - Delete resource

### Status
- `GET /api/status/complaint/:id` - Get complaint status with workorders
- `GET /api/status/workorder/:id` - Get workorder status with details
- `GET /api/status/overview` - Get status overview (complaints, workorders, crew)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/stats` - Get general statistics
- `GET /api/analytics/categories` - Get category statistics
- `GET /api/analytics/trends` - Get trends data (query: `days`)

### Health Check
- `GET /api/health` - Server health check

## 📊 Database

Currently uses an **in-memory database** for development. In production, replace `server/database/db.js` with:
- MongoDB (using Mongoose)
- PostgreSQL (using Sequelize or Prisma)
- MySQL (using Sequelize)

The database structure includes:
- Complaints
- Workorders
- Crew
- Inventory
- Resources
- Analytics (computed from other collections)

## 🔒 Authentication

Currently uses mock authentication. For production:
1. Implement JWT token generation/verification
2. Add password hashing (bcrypt)
3. Add middleware to protect routes
4. Store users in database

## 📝 Request/Response Format

All responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Testing

Test the API using:
- **Postman** - Import the API collection
- **cURL** - Command line requests
- **Frontend** - Connect via `src/lib/api.ts`

Example request:
```bash
curl http://localhost:3000/api/complaints
```

## 🔧 Development

- The server uses Express.js
- CORS is enabled for all origins (configure in production)
- Auto-reload in dev mode with `--watch` flag
- Error handling middleware catches all errors

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper database connection
3. Set up JWT secrets
4. Configure CORS for your domain
5. Use a process manager (PM2, etc.)
6. Set up HTTPS
7. Configure rate limiting

## 🐛 Troubleshooting

**Port already in use:**
- Change `PORT` in `.env`
- Or kill the process using port 3000

**CORS errors:**
- Update CORS configuration in `index.js`
- Ensure frontend URL is allowed

**Database errors:**
- Check database connection string
- Ensure database server is running

---

For questions or issues, check the main project README or open an issue.

