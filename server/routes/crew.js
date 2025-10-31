import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/crew - Get all crew members
router.get('/', (req, res) => {
  try {
    const { status, skill } = req.query;
    let crew = db.crew.findAll();

    // Filter by status
    if (status) {
      crew = crew.filter(c => c.status === status);
    }

    // Filter by skill
    if (skill) {
      crew = crew.filter(c => 
        c.skills && c.skills.includes(skill)
      );
    }

    res.json({
      success: true,
      data: crew,
      count: crew.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/crew/:id - Get crew member by ID
router.get('/:id', (req, res) => {
  try {
    const member = db.crew.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Crew member not found',
      });
    }
    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/crew - Create new crew member
router.post('/', (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      skills,
      status,
      currentAssignment,
      availability,
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email',
      });
    }

    const newMember = db.crew.create({
      name,
      email,
      phone: phone || null,
      skills: skills || [],
      status: status || 'available',
      currentAssignment: currentAssignment || null,
      availability: availability || 'full-time',
      rating: 0,
      totalJobs: 0,
      completedJobs: 0,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: newMember,
      message: 'Crew member created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/crew/:id - Update crew member
router.patch('/:id', (req, res) => {
  try {
    const member = db.crew.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Crew member not found',
      });
    }

    const updated = db.crew.update(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Crew member updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/crew/:id/status - Update crew member status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, currentAssignment } = req.body;
    const member = db.crew.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Crew member not found',
      });
    }

    const updates = {};
    if (status) updates.status = status;
    if (currentAssignment !== undefined) updates.currentAssignment = currentAssignment;

    const updated = db.crew.update(req.params.id, updates);
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

// DELETE /api/crew/:id - Delete crew member
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.crew.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Crew member not found',
      });
    }
    res.json({
      success: true,
      message: 'Crew member deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/crew/available - Get available crew members
router.get('/available/list', (req, res) => {
  try {
    const availableCrew = db.crew.findByStatus('available');
    res.json({
      success: true,
      data: availableCrew,
      count: availableCrew.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

