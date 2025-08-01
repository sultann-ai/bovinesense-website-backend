import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or admin account deactivated.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

// Middleware to check if user is super admin
export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Super admin privileges required.' 
    });
  }
  next();
};