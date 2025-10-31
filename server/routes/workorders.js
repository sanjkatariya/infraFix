import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/workorders - Get all workorders
router.get('/', (req, res) => {
  try {
    const { status, crewId, complaintId } = req.query;
    let workorders = db.workorders.findAll();

    // Filter by status
    if (status) {
      workorders = workorders.filter(w => w.status === status);
    }

    // Filter by crew ID
    if (crewId) {
      workorders = workorders.filter(w => 
        w.assignedCrew && w.assignedCrew.includes(crewId)
      );
    }

    // Filter by complaint ID
    if (complaintId) {
      workorders = workorders.filter(w => w.complaintId === complaintId);
    }

    res.json({
      success: true,
      data: workorders,
      count: workorders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/workorders/:id - Get workorder by ID
router.get('/:id', (req, res) => {
  try {
    const workorder = db.workorders.findById(req.params.id);
    if (!workorder) {
      return res.status(404).json({
        success: false,
        error: 'Workorder not found',
      });
    }
    res.json({
      success: true,
      data: workorder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/workorders - Create new workorder
router.post('/', (req, res) => {
  try {
    const {
      complaintId,
      title,
      description,
      priority,
      assignedCrew,
      estimatedCost,
      estimatedTime,
      requiredResources,
      status,
    } = req.body;

    // Validate required fields
    if (!complaintId || !title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: complaintId, title',
      });
    }

    // Verify complaint exists
    const complaint = db.complaints.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    const newWorkorder = db.workorders.create({
      complaintId,
      title,
      description: description || complaint.description,
      priority: priority || complaint.priority || 5,
      assignedCrew: assignedCrew || [],
      estimatedCost: estimatedCost || null,
      estimatedTime: estimatedTime || null,
      requiredResources: requiredResources || [],
      status: status || 'pending',
      progress: 0,
      startDate: null,
      completedDate: null,
      actualCost: null,
      notes: [],
      createdAt: new Date().toISOString(),
    });

    // Update complaint status
    db.complaints.update(complaintId, {
      status: 'in-progress',
      progress: 10,
    });

    res.status(201).json({
      success: true,
      data: newWorkorder,
      message: 'Workorder created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/workorders/:id - Update workorder
router.patch('/:id', (req, res) => {
  try {
    const workorder = db.workorders.findById(req.params.id);
    if (!workorder) {
      return res.status(404).json({
        success: false,
        error: 'Workorder not found',
      });
    }

    const updated = db.workorders.update(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Workorder updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/workorders/:id/status - Update workorder status
router.patch('/:id/status', (req, res) => {
  try {
    const { status, progress } = req.body;
    const workorder = db.workorders.findById(req.params.id);
    if (!workorder) {
      return res.status(404).json({
        success: false,
        error: 'Workorder not found',
      });
    }

    const updates = {};
    if (status) updates.status = status;
    if (progress !== undefined) updates.progress = progress;

    if (status === 'in-progress' && !workorder.startDate) {
      updates.startDate = new Date().toISOString();
    }

    if (status === 'completed') {
      updates.progress = 100;
      updates.completedDate = new Date().toISOString();
      
      // Update complaint status
      if (workorder.complaintId) {
        db.complaints.update(workorder.complaintId, {
          status: 'resolved',
          progress: 100,
        });
      }
    }

    const updated = db.workorders.update(req.params.id, updates);
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

// DELETE /api/workorders/:id - Delete workorder
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.workorders.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Workorder not found',
      });
    }
    res.json({
      success: true,
      message: 'Workorder deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/workorders/complaint/:complaintId - Get workorders by complaint
router.get('/complaint/:complaintId', (req, res) => {
  try {
    const workorders = db.workorders.findByComplaintId(req.params.complaintId);
    res.json({
      success: true,
      data: workorders,
      count: workorders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

