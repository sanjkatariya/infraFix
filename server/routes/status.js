import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/status/complaint/:id - Get complaint status
router.get('/complaint/:id', (req, res) => {
  try {
    const complaint = db.complaints.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: 'Complaint not found',
      });
    }

    // Get related workorders
    const workorders = db.workorders.findByComplaintId(req.params.id);

    res.json({
      success: true,
      data: {
        complaint: {
          id: complaint.id,
          status: complaint.status,
          progress: complaint.progress,
          category: complaint.category,
          location: complaint.location,
          createdAt: complaint.createdAt,
          updatedAt: complaint.updatedAt,
        },
        workorders: workorders.map(wo => ({
          id: wo.id,
          status: wo.status,
          progress: wo.progress,
          title: wo.title,
          assignedCrew: wo.assignedCrew,
          startDate: wo.startDate,
          completedDate: wo.completedDate,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/status/workorder/:id - Get workorder status
router.get('/workorder/:id', (req, res) => {
  try {
    const workorder = db.workorders.findById(req.params.id);
    if (!workorder) {
      return res.status(404).json({
        success: false,
        error: 'Workorder not found',
      });
    }

    // Get assigned crew details
    const crewDetails = workorder.assignedCrew
      ? workorder.assignedCrew.map(crewId => db.crew.findById(crewId)).filter(Boolean)
      : [];

    // Get complaint details
    const complaint = workorder.complaintId
      ? db.complaints.findById(workorder.complaintId)
      : null;

    res.json({
      success: true,
      data: {
        workorder: {
          id: workorder.id,
          status: workorder.status,
          progress: workorder.progress,
          title: workorder.title,
          description: workorder.description,
          priority: workorder.priority,
          startDate: workorder.startDate,
          completedDate: workorder.completedDate,
          estimatedCost: workorder.estimatedCost,
          actualCost: workorder.actualCost,
        },
        crew: crewDetails,
        complaint: complaint ? {
          id: complaint.id,
          category: complaint.category,
          location: complaint.location,
        } : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/status/overview - Get status overview
router.get('/overview', (req, res) => {
  try {
    const complaints = db.complaints.findAll();
    const workorders = db.workorders.findAll();
    const crew = db.crew.findAll();

    const statusOverview = {
      complaints: {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        'in-progress': complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
      },
      workorders: {
        total: workorders.length,
        pending: workorders.filter(w => w.status === 'pending').length,
        'in-progress': workorders.filter(w => w.status === 'in-progress').length,
        completed: workorders.filter(w => w.status === 'completed').length,
      },
      crew: {
        total: crew.length,
        available: crew.filter(c => c.status === 'available').length,
        busy: crew.filter(c => c.status === 'busy').length,
        'on-leave': crew.filter(c => c.status === 'on-leave').length,
      },
    };

    res.json({
      success: true,
      data: statusOverview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

