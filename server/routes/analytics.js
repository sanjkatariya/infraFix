import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', (req, res) => {
  try {
    const stats = db.analytics.getStats();
    const categoryStats = db.analytics.getCategoryStats();
    const trends = db.analytics.getTrends(7);

    res.json({
      success: true,
      data: {
        stats,
        categoryStats,
        trends,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/analytics/stats - Get general statistics
router.get('/stats', (req, res) => {
  try {
    const stats = db.analytics.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/analytics/categories - Get category statistics
router.get('/categories', (req, res) => {
  try {
    const categoryStats = db.analytics.getCategoryStats();
    res.json({
      success: true,
      data: categoryStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/analytics/trends - Get trends data
router.get('/trends', (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const trends = db.analytics.getTrends(days);
    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

