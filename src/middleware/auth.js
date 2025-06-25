import jwt from 'jsonwebtoken';
import { pool } from '../database/connection.js';

// JWT Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await pool.query(
      'SELECT id, email, name, is_admin, subscription_type, max_projects, max_tables, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid token - user not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ 
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// API Key Authentication middleware
export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        code: 'API_KEY_REQUIRED'
      });
    }

    // Check if it's a project API key
    let result = await pool.query(
      `SELECT p.id as project_id, p.user_id, p.name as project_name, u.subscription_type
       FROM projects p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.api_key = $1 AND u.is_active = true`,
      [apiKey]
    );

    if (result.rows.length > 0) {
      // Project API key
      const project = result.rows[0];
      req.project = {
        id: project.project_id,
        userId: project.user_id,
        name: project.project_name,
        subscriptionType: project.subscription_type
      };
      req.apiKeyType = 'project';
      return next();
    }

    // Check if it's an additional API key
    result = await pool.query(
      `SELECT ak.*, p.id as project_id, p.user_id, p.name as project_name, u.subscription_type
       FROM api_keys ak
       JOIN projects p ON ak.project_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE ak.key_value = $1 AND ak.is_active = true AND u.is_active = true`,
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }

    const apiKeyData = result.rows[0];

    // Check if API key is expired
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return res.status(401).json({ 
        error: 'API key expired',
        code: 'API_KEY_EXPIRED'
      });
    }

    // Update usage count and last used
    await pool.query(
      'UPDATE api_keys SET usage_count = usage_count + 1, last_used_at = NOW() WHERE id = $1',
      [apiKeyData.id]
    );

    req.project = {
      id: apiKeyData.project_id,
      userId: apiKeyData.user_id,
      name: apiKeyData.project_name,
      subscriptionType: apiKeyData.subscription_type
    };
    req.apiKey = {
      id: apiKeyData.id,
      permissions: apiKeyData.permissions,
      rateLimit: apiKeyData.rate_limit
    };
    req.apiKeyType = 'additional';

    next();
  } catch (error) {
    console.error('API Key auth error:', error);
    res.status(500).json({ 
      error: 'API key authentication failed',
      code: 'API_KEY_AUTH_ERROR'
    });
  }
};

// Check API key permissions
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // Project API keys have all permissions
    if (req.apiKeyType === 'project') {
      return next();
    }

    // Check additional API key permissions
    if (!req.apiKey || !req.apiKey.permissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        error: `Permission '${requiredPermission}' required`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.is_admin) {
      return res.status(403).json({ 
        error: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      error: 'Authorization check failed',
      code: 'AUTH_CHECK_ERROR'
    });
  }
};