import express from 'express';
import { pool } from '../database/connection.js';
import { authenticateToken, authenticateApiKey } from '../middleware/auth.js';
import { validateProjectCreation, validateProjectUpdate, validateUUID } from '../middleware/validation.js';
import { ApiKeyGenerator } from '../utils/apiKeyGenerator.js';

const router = express.Router();

// Get all projects for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT p.*, 
              (SELECT COUNT(*) FROM project_tables pt WHERE pt.project_id = p.id) as table_count
       FROM projects p 
       WHERE p.user_id = $1 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM projects WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      projects: result.rows.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        apiKey: project.api_key,
        isPublic: project.is_public,
        settings: project.settings,
        tableCount: parseInt(project.table_count),
        createdAt: project.created_at,
        updatedAt: project.updated_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      code: 'FETCH_PROJECTS_ERROR'
    });
  }
});

// Get single project by ID
router.get('/:projectId', validateUUID('projectId'), authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT p.*, 
              (SELECT COUNT(*) FROM project_tables pt WHERE pt.project_id = p.id) as table_count
       FROM projects p 
       WHERE p.id = $1 AND p.user_id = $2`,
      [projectId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    const project = result.rows[0];

    // Get project tables
    const tablesResult = await pool.query(
      'SELECT * FROM project_tables WHERE project_id = $1 ORDER BY created_at',
      [projectId]
    );

    // Get API keys
    const apiKeysResult = await pool.query(
      'SELECT id, name, permissions, is_active, usage_count, rate_limit, expires_at, last_used_at, created_at FROM api_keys WHERE project_id = $1 ORDER BY created_at',
      [projectId]
    );

    res.json({
      id: project.id,
      name: project.name,
      description: project.description,
      apiKey: project.api_key,
      isPublic: project.is_public,
      settings: project.settings,
      tableCount: parseInt(project.table_count),
      tables: tablesResult.rows,
      apiKeys: apiKeysResult.rows,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      code: 'FETCH_PROJECT_ERROR'
    });
  }
});

// Create new project
router.post('/', authenticateToken, validateProjectCreation, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check project limits
    if (req.user.max_projects !== -1) {
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM projects WHERE user_id = $1',
        [req.user.id]
      );

      if (parseInt(countResult.rows[0].count) >= req.user.max_projects) {
        return res.status(403).json({
          error: 'Project limit reached',
          code: 'PROJECT_LIMIT_REACHED',
          limit: req.user.max_projects
        });
      }
    }

    // Check if project name already exists for this user
    const existingProject = await pool.query(
      'SELECT id FROM projects WHERE user_id = $1 AND LOWER(name) = LOWER($2)',
      [req.user.id, name]
    );

    if (existingProject.rows.length > 0) {
      return res.status(409).json({
        error: 'Project name already exists',
        code: 'PROJECT_NAME_EXISTS'
      });
    }

    // Generate API key
    const apiKey = ApiKeyGenerator.generateProjectApiKey(crypto.randomUUID(), name);

    // Create project
    const result = await pool.query(
      `INSERT INTO projects (name, description, user_id, api_key, settings) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        name,
        description || null,
        req.user.id,
        apiKey,
        {
          allowApiAccess: true,
          requireAuth: false,
          maxRequestsPerMinute: req.user.subscription_type === 'free' ? 100 : 
                                req.user.subscription_type === 'basic' ? 1000 :
                                req.user.subscription_type === 'premium' ? 10000 : -1,
          enableWebhooks: req.user.subscription_type !== 'free'
        }
      ]
    );

    const project = result.rows[0];

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        apiKey: project.api_key,
        isPublic: project.is_public,
        settings: project.settings,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Failed to create project',
      code: 'CREATE_PROJECT_ERROR'
    });
  }
});

// Update project
router.put('/:projectId', validateUUID('projectId'), authenticateToken, validateProjectUpdate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, settings } = req.body;

    // Check if project exists and belongs to user
    const existingProject = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Check if new name conflicts with existing projects
    if (name) {
      const nameConflict = await pool.query(
        'SELECT id FROM projects WHERE user_id = $1 AND LOWER(name) = LOWER($2) AND id != $3',
        [req.user.id, name, projectId]
      );

      if (nameConflict.rows.length > 0) {
        return res.status(409).json({
          error: 'Project name already exists',
          code: 'PROJECT_NAME_EXISTS'
        });
      }
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (settings !== undefined) {
      updates.push(`settings = $${paramCount++}`);
      values.push(JSON.stringify({ ...existingProject.rows[0].settings, ...settings }));
    }

    updates.push(`updated_at = NOW()`);
    values.push(projectId);

    const result = await pool.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    const project = result.rows[0];

    res.json({
      message: 'Project updated successfully',
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        apiKey: project.api_key,
        isPublic: project.is_public,
        settings: project.settings,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Failed to update project',
      code: 'UPDATE_PROJECT_ERROR'
    });
  }
});

// Delete project
router.delete('/:projectId', validateUUID('projectId'), authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and belongs to user
    const existingProject = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get all tables for this project
      const tablesResult = await client.query(
        'SELECT name FROM project_tables WHERE project_id = $1',
        [projectId]
      );

      // Drop all physical tables
      for (const table of tablesResult.rows) {
        const physicalTableName = `project_${projectId.replace(/-/g, '_')}_${table.name}`;
        await client.query(`DROP TABLE IF EXISTS ${physicalTableName} CASCADE`);
      }

      // Delete project (cascade will handle related records)
      await client.query('DELETE FROM projects WHERE id = $1', [projectId]);

      await client.query('COMMIT');

      res.json({
        message: 'Project deleted successfully'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      code: 'DELETE_PROJECT_ERROR'
    });
  }
});

// Regenerate project API key
router.post('/:projectId/regenerate-api-key', validateUUID('projectId'), authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and belongs to user
    const existingProject = await pool.query(
      'SELECT name FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (existingProject.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Generate new API key
    const newApiKey = ApiKeyGenerator.generateProjectApiKey(projectId, existingProject.rows[0].name);

    // Update project
    const result = await pool.query(
      'UPDATE projects SET api_key = $1, updated_at = NOW() WHERE id = $2 RETURNING api_key',
      [newApiKey, projectId]
    );

    res.json({
      message: 'API key regenerated successfully',
      apiKey: result.rows[0].api_key
    });

  } catch (error) {
    console.error('Regenerate API key error:', error);
    res.status(500).json({
      error: 'Failed to regenerate API key',
      code: 'REGENERATE_API_KEY_ERROR'
    });
  }
});

// Get project by API key (for external access)
router.get('/by-api-key/:apiKey', authenticateApiKey, async (req, res) => {
  try {
    const projectId = req.project.id;

    // Get project details
    const result = await pool.query(
      'SELECT id, name, description, is_public, settings, created_at FROM projects WHERE id = $1',
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    const project = result.rows[0];

    // Get project tables
    const tablesResult = await pool.query(
      'SELECT id, name, schema_definition, created_at FROM project_tables WHERE project_id = $1 ORDER BY created_at',
      [projectId]
    );

    res.json({
      id: project.id,
      name: project.name,
      description: project.description,
      isPublic: project.is_public,
      settings: project.settings,
      tables: tablesResult.rows,
      createdAt: project.created_at
    });

  } catch (error) {
    console.error('Get project by API key error:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      code: 'FETCH_PROJECT_ERROR'
    });
  }
});

export default router;