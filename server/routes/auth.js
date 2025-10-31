import express from 'express';

const router = express.Router();

// Simple mock authentication for development
// In production, implement proper JWT authentication

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Mock authentication - in production, verify against database
    // For now, accept any login with role
    const mockUser = {
      id: '1',
      email: email || `${role}@example.com`,
      name: role === 'admin' ? 'Admin User' : 'Citizen User',
      role: role || 'citizen',
    };

    // Mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;

    res.json({
      success: true,
      data: {
        user: mockUser,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  try {
    // In production, extract user from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Mock user - in production, decode JWT and get from database
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      name: 'User',
      role: 'citizen',
    };

    res.json({
      success: true,
      data: mockUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

