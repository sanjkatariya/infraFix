import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/complaints - Get all complaints
router.get('/', (req, res) => {
  try {
    const { status, category, userId } = req.query;
    let complaints = db.complaints.findAll();

    // Filter by status
    if (status) {
      complaints = complaints.filter(c => c.status === status);
    }

    // Filter by category
    if (category) {
      complaints = complaints.filter(c => c.category === category);
    }

    // Filter by user ID
    if (userId) {
      complaints = complaints.filter(c => c.userId === userId);
    }

    res.json({
      success: true,
      data: complaints,
      count: complaints.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', (req, res) => {
  try {
    const complaint = db.complaints.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }
    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/complaints - Create new complaint
router.post('/', (req, res) => {
  try {
    const {
      userId,
      category,
      description,
      location,
      coordinates,
      phone,
      images,
      priority,
      issueType,
    } = req.body;

    // Validate required fields
    if (!category || !description || !location) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, description, location',
      });
    }

    const newComplaint = db.complaints.create({
      userId: userId || 'anonymous',
      category,
      description,
      location,
      coordinates: coordinates || null,
      phone: phone || null,
      images: images || [],
      priority: priority || 5,
      issueType: issueType || category,
      status: 'pending',
      progress: 0,
      assignedCrew: null,
      estimatedCost: null,
      estimatedTime: null,
      notes: [],
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: newComplaint,
      message: 'Complaint created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/complaints/:id - Update complaint
router.patch('/:id', (req, res) => {
  try {
    const complaint = db.complaints.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    const updated = db.complaints.update(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Complaint updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/complaints/:id/status - Update complaint status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, progress } = req.body;
    const complaint = db.complaints.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    const updates = { status };
    if (progress !== undefined) {
      updates.progress = progress;
    }

    const updated = db.complaints.update(req.params.id, updates);
    res.json({
      success: true,
      data: updated,
      message: 'Status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.complaints.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }
    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/complaints/user/:userId - Get complaints by user
router.get('/user/:userId', (req, res) => {
  try {
    const complaints = db.complaints.findByUserId(req.params.userId);
    res.json({
      success: true,
      data: complaints,
      count: complaints.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

