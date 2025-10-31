import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/resources - Get all resources
router.get('/', (req, res) => {
  try {
    const { type, status } = req.query;
    let resources = db.resources.findAll();

    // Filter by type
    if (type) {
      resources = resources.filter(r => r.type === type);
    }

    // Filter by status
    if (status) {
      resources = resources.filter(r => r.status === status);
    }

    res.json({
      success: true,
      data: resources,
      count: resources.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/resources/:id - Get resource by ID
router.get('/:id', (req, res) => {
  try {
    const resource = db.resources.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/resources - Create new resource
router.post('/', (req, res) => {
  try {
    const {
      name,
      type,
      description,
      status,
      location,
      capacity,
      currentUsage,
      assignedTo,
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type',
      });
    }

    const newResource = db.resources.create({
      name,
      type,
      description: description || null,
      status: status || 'available',
      location: location || null,
      capacity: capacity || null,
      currentUsage: currentUsage || 0,
      assignedTo: assignedTo || null,
      maintenanceSchedule: null,
      lastMaintenance: null,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: newResource,
      message: 'Resource created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/resources/:id - Update resource
router.patch('/:id', (req, res) => {
  try {
    const resource = db.resources.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }

    const updated = db.resources.update(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Resource updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/resources/:id/assign - Assign resource
router.patch('/:id/assign', (req, res) => {
  try {
    const { assignedTo, workorderId } = req.body;
    const resource = db.resources.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }

    const updated = db.resources.update(req.params.id, {
      status: 'in-use',
      assignedTo,
      currentAssignment: workorderId || null,
    });

    res.json({
      success: true,
      data: updated,
      message: 'Resource assigned successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/resources/:id/release - Release resource
router.patch('/:id/release', (req, res) => {
  try {
    const resource = db.resources.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }

    const updated = db.resources.update(req.params.id, {
      status: 'available',
      assignedTo: null,
      currentAssignment: null,
    });

    res.json({
      success: true,
      data: updated,
      message: 'Resource released successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/resources/:id - Delete resource
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.resources.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    res.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

