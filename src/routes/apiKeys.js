import express from 'express';
import { pool } from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateApiKeyCreation, validateUUID } from '../middleware/validation.js';
import { ApiKeyGenerator } from '../utils/apiKeyGenerator.js';

const router = express.Router();

// Get all API keys for a project
router.get('/project/:projectId', validateUUID('projectId'), authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and belongs to user
    const projectResult = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Get API keys
    const result = await pool.query(
      'SELECT id, name, permissions, is_active, usage_count, rate_limit, expires_at, last_used_at, created_at FROM api_keys WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );

    res.json({
      apiKeys: result.rows
    });

  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      error: 'Failed to fetch API keys',
      code: 'FETCH_API_KEYS_ERROR'
    });
  }
});

// Create new API key
router.post('/project/:projectId', validateUUID('projectId'), authenticateToken, validateApiKeyCreation, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, permissions, expiresAt, rateLimit = 1000 } = req.body;

    // Check if project exists and belongs to user
    const projectResult = await pool.query(
      'SELECT name FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Generate API key
    const apiKeyData = ApiKeyGenerator.generateKeyWithPermissions(projectId, name, permissions);

    // Create API key record
    const result = await pool.query(
      `INSERT INTO api_keys (project_id, key_value, name, permissions, rate_limit, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, permissions, is_active, usage_count, rate_limit, expires_at, created_at`,
      [
        projectId,
        apiKeyData.key,
        name,
        JSON.stringify(permissions),
        rateLimit,
        expiresAt || null
      ]
    );

    const createdApiKey = result.rows[0];

    res.status(201).json({
      message: 'API key created successfully',
      apiKey: {
        ...createdApiKey,
        key: apiKeyData.key // Include the actual key in response (only shown once)
      }
    });

  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      error: 'Failed to create API key',
      code: 'CREATE_API_KEY_ERROR'
    });
  }
});

// Update API key
router.put('/:keyId', validateUUID('keyId'), authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;
    const { name, permissions, isActive, rateLimit } = req.body;

    // Check if API key exists and belongs to user's project
    const keyResult = await pool.query(
      `SELECT ak.* FROM api_keys ak
       JOIN projects p ON ak.project_id = p.id
       WHERE ak.id = $1 AND p.user_id = $2`,
      [keyId, req.user.id]
    );

    if (keyResult.rows.length === 0) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (permissions !== undefined) {
      updates.push(`permissions = $${paramCount++}`);
      values.push(JSON.stringify(permissions));
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(isActive);
    }

    if (rateLimit !== undefined) {
      updates.push(`rate_limit = $${paramCount++}`);
      values.push(rateLimit);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        code: 'NO_UPDATE_FIELDS'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(keyId);

    const result = await pool.query(
      `UPDATE api_keys SET ${updates.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, name, permissions, is_active, usage_count, rate_limit, expires_at, last_used_at, created_at`,
      values
    );

    res.json({
      message: 'API key updated successfully',
      apiKey: result.rows[0]
    });

  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      error: 'Failed to update API key',
      code: 'UPDATE_API_KEY_ERROR'
    });
  }
});

// Delete API key
router.delete('/:keyId', validateUUID('keyId'), authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;

    // Check if API key exists and belongs to user's project
    const keyResult = await pool.query(
      `SELECT ak.id FROM api_keys ak
       JOIN projects p ON ak.project_id = p.id
       WHERE ak.id = $1 AND p.user_id = $2`,
      [keyId, req.user.id]
    );

    if (keyResult.rows.length === 0) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    // Delete API key
    await pool.query('DELETE FROM api_keys WHERE id = $1', [keyId]);

    res.json({
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      error: 'Failed to delete API key',
      code: 'DELETE_API_KEY_ERROR'
    });
  }
});

// Get API key usage statistics
router.get('/:keyId/stats', validateUUID('keyId'), authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;

    // Check if API key exists and belongs to user's project
    const keyResult = await pool.query(
      `SELECT ak.* FROM api_keys ak
       JOIN projects p ON ak.project_id = p.id
       WHERE ak.id = $1 AND p.user_id = $2`,
      [keyId, req.user.id]
    );

    if (keyResult.rows.length === 0) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'API_KEY_NOT_FOUND'
      });
    }

    const apiKey = keyResult.rows[0];

    res.json({
      stats: {
        id: apiKey.id,
        name: apiKey.name,
        usageCount: apiKey.usage_count,
        rateLimit: apiKey.rate_limit,
        lastUsedAt: apiKey.last_used_at,
        isActive: apiKey.is_active,
        isExpired: apiKey.expires_at ? new Date(apiKey.expires_at) < new Date() : false,
        createdAt: apiKey.created_at
      }
    });

  } catch (error) {
    console.error('Get API key stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch API key statistics',
      code: 'FETCH_API_KEY_STATS_ERROR'
    });
  }
});

export default router;