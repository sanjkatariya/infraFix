import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// GET /api/inventory - Get all inventory items
router.get('/', (req, res) => {
  try {
    const { category, lowStock } = req.query;
    let items = db.inventory.findAll();

    // Filter by category
    if (category) {
      items = items.filter(i => i.category === category);
    }

    // Filter low stock items
    if (lowStock === 'true') {
      items = items.filter(i => {
        const threshold = i.lowStockThreshold || 10;
        return i.quantity <= threshold;
      });
    }

    res.json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/inventory/:id - Get inventory item by ID
router.get('/:id', (req, res) => {
  try {
    const item = db.inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found',
      });
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/inventory - Create new inventory item
router.post('/', (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      unit,
      cost,
      supplier,
      lowStockThreshold,
    } = req.body;

    // Validate required fields
    if (!name || !category || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, category, quantity',
      });
    }

    const newItem = db.inventory.create({
      name,
      description: description || null,
      category,
      quantity: quantity || 0,
      unit: unit || 'pieces',
      cost: cost || null,
      supplier: supplier || null,
      lowStockThreshold: lowStockThreshold || 10,
      location: null,
      lastRestocked: null,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Inventory item created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/inventory/:id - Update inventory item
router.patch('/:id', (req, res) => {
  try {
    const item = db.inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found',
      });
    }

    const updated = db.inventory.update(req.params.id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Inventory item updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PATCH /api/inventory/:id/stock - Update inventory stock
router.patch('/:id/stock', (req, res) => {
  try {
    const { quantity, action } = req.body; // action: 'add', 'subtract', or 'set'
    const item = db.inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found',
      });
    }

    let newQuantity = item.quantity;
    if (action === 'add') {
      newQuantity = item.quantity + (quantity || 0);
    } else if (action === 'subtract') {
      newQuantity = Math.max(0, item.quantity - (quantity || 0));
    } else if (action === 'set' || !action) {
      newQuantity = quantity;
    }

    const updated = db.inventory.update(req.params.id, {
      quantity: newQuantity,
      lastRestocked: action === 'add' ? new Date().toISOString() : item.lastRestocked,
    });

    res.json({
      success: true,
      data: updated,
      message: 'Stock updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.inventory.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found',
      });
    }
    res.json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/inventory/category/:category - Get items by category
router.get('/category/:category', (req, res) => {
  try {
    const items = db.inventory.findByCategory(req.params.category);
    res.json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

