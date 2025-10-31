import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import complaintsRoutes from './routes/complaints.js';
import workordersRoutes from './routes/workorders.js';
import crewRoutes from './routes/crew.js';
import inventoryRoutes from './routes/inventory.js';
import resourcesRoutes from './routes/resources.js';
import statusRoutes from './routes/status.js';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/workorders', workordersRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InfraFix API Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 InfraFix API Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
});

