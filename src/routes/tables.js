import express from 'express';
import { pool } from '../database/connection.js';
import { authenticateToken, authenticateApiKey, checkPermission } from '../middleware/auth.js';
import { validateTableCreation, validateUUID } from '../middleware/validation.js';
import { TableManager } from '../utils/tableManager.js';

const router = express.Router();

// Get all tables for a project
router.get('/:projectId/tables', validateUUID('projectId'), authenticateToken, async (req, res) => {
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

    // Get tables
    const result = await pool.query(
      'SELECT * FROM project_tables WHERE project_id = $1 ORDER BY created_at',
      [projectId]
    );

    res.json({
      tables: result.rows.map(table => ({
        id: table.id,
        name: table.name,
        fields: table.schema_definition.fields || [],
        createdAt: table.created_at,
        updatedAt: table.updated_at
      }))
    });

  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      error: 'Failed to fetch tables',
      code: 'FETCH_TABLES_ERROR'
    });
  }
});

// Get tables via API key
router.get('/:projectId/tables/api', validateUUID('projectId'), authenticateApiKey, checkPermission('read'), async (req, res) => {
  try {
    const { projectId } = req.params;

    if (req.project.id !== projectId) {
      return res.status(403).json({
        error: 'Access denied to this project',
        code: 'PROJECT_ACCESS_DENIED'
      });
    }

    // Get tables
    const result = await pool.query(
      'SELECT * FROM project_tables WHERE project_id = $1 ORDER BY created_at',
      [projectId]
    );

    res.json({
      tables: result.rows.map(table => ({
        id: table.id,
        name: table.name,
        fields: table.schema_definition.fields || [],
        createdAt: table.created_at,
        updatedAt: table.updated_at
      }))
    });

  } catch (error) {
    console.error('Get tables via API error:', error);
    res.status(500).json({
      error: 'Failed to fetch tables',
      code: 'FETCH_TABLES_ERROR'
    });
  }
});

// Get single table
router.get('/:projectId/tables/:tableId', validateUUID('projectId'), validateUUID('tableId'), authenticateToken, async (req, res) => {
  try {
    const { projectId, tableId } = req.params;

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

    // Get table
    const result = await pool.query(
      'SELECT * FROM project_tables WHERE id = $1 AND project_id = $2',
      [tableId, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Table not found',
        code: 'TABLE_NOT_FOUND'
      });
    }

    const table = result.rows[0];

    res.json({
      id: table.id,
      name: table.name,
      fields: table.schema_definition.fields || [],
      createdAt: table.created_at,
      updatedAt: table.updated_at
    });

  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({
      error: 'Failed to fetch table',
      code: 'FETCH_TABLE_ERROR'
    });
  }
});

// Create new table
router.post('/:projectId/tables', validateUUID('projectId'), authenticateToken, validateTableCreation, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, fields } = req.body;

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

    // Check table limits
    if (req.user.max_tables !== -1) {
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM project_tables pt 
         JOIN projects p ON pt.project_id = p.id 
         WHERE p.user_id = $1`,
        [req.user.id]
      );

      if (parseInt(countResult.rows[0].count) >= req.user.max_tables) {
        return res.status(403).json({
          error: 'Table limit reached',
          code: 'TABLE_LIMIT_REACHED',
          limit: req.user.max_tables
        });
      }
    }

    // Check if table name already exists in project
    const existingTable = await pool.query(
      'SELECT id FROM project_tables WHERE project_id = $1 AND LOWER(name) = LOWER($2)',
      [projectId, name]
    );

    if (existingTable.rows.length > 0) {
      return res.status(409).json({
        error: 'Table name already exists in this project',
        code: 'TABLE_NAME_EXISTS'
      });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create physical table
      const physicalTableName = await TableManager.createPhysicalTable(projectId, name, fields);

      // Create table metadata
      const result = await client.query(
        `INSERT INTO project_tables (project_id, name, schema_definition) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [projectId, name, JSON.stringify({ fields, physicalTableName })]
      );

      await client.query('COMMIT');

      const table = result.rows[0];

      res.status(201).json({
        message: 'Table created successfully',
        table: {
          id: table.id,
          name: table.name,
          fields: table.schema_definition.fields || [],
          createdAt: table.created_at,
          updatedAt: table.updated_at
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({
      error: 'Failed to create table',
      code: 'CREATE_TABLE_ERROR'
    });
  }
});

// Create table via API key
router.post('/:projectId/tables/api', validateUUID('projectId'), authenticateApiKey, checkPermission('write'), validateTableCreation, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, fields } = req.body;

    if (req.project.id !== projectId) {
      return res.status(403).json({
        error: 'Access denied to this project',
        code: 'PROJECT_ACCESS_DENIED'
      });
    }

    // Check if table name already exists in project
    const existingTable = await pool.query(
      'SELECT id FROM project_tables WHERE project_id = $1 AND LOWER(name) = LOWER($2)',
      [projectId, name]
    );

    if (existingTable.rows.length > 0) {
      return res.status(409).json({
        error: 'Table name already exists in this project',
        code: 'TABLE_NAME_EXISTS'
      });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Create physical table
      const physicalTableName = await TableManager.createPhysicalTable(projectId, name, fields);

      // Create table metadata
      const result = await client.query(
        `INSERT INTO project_tables (project_id, name, schema_definition) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [projectId, name, JSON.stringify({ fields, physicalTableName })]
      );

      await client.query('COMMIT');

      const table = result.rows[0];

      res.status(201).json({
        message: 'Table created successfully',
        table: {
          id: table.id,
          name: table.name,
          fields: table.schema_definition.fields || [],
          createdAt: table.created_at,
          updatedAt: table.updated_at
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create table via API error:', error);
    res.status(500).json({
      error: 'Failed to create table',
      code: 'CREATE_TABLE_ERROR'
    });
  }
});

// Add field to existing table
router.post('/:projectId/tables/:tableId/fields', validateUUID('projectId'), validateUUID('tableId'), authenticateToken, async (req, res) => {
  try {
    const { projectId, tableId } = req.params;
    const { name, type, required = false, validation, description } = req.body;

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

    // Get table
    const tableResult = await pool.query(
      'SELECT * FROM project_tables WHERE id = $1 AND project_id = $2',
      [tableId, projectId]
    );

    if (tableResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Table not found',
        code: 'TABLE_NOT_FOUND'
      });
    }

    const table = tableResult.rows[0];
    const currentFields = table.schema_definition.fields || [];
    
    // Check if field name already exists
    const fieldExists = currentFields.some(
      field => field.name.toLowerCase() === name.toLowerCase()
    );
    
    if (fieldExists) {
      return res.status(409).json({
        error: 'Field name already exists in this table',
        code: 'FIELD_NAME_EXISTS'
      });
    }

    // Create new field
    const newField = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      required,
      validation: validation || undefined,
      description: description || undefined,
    };

    // Add field to schema
    const updatedFields = [...currentFields, newField];
    const updatedSchema = {
      ...table.schema_definition,
      fields: updatedFields
    };

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update table metadata
      const result = await client.query(
        'UPDATE project_tables SET schema_definition = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [JSON.stringify(updatedSchema), tableId]
      );

      // Add physical column if table has physical representation
      try {
        await TableManager.addColumn(projectId, table.name, newField);
      } catch (columnError) {
        console.warn('Could not add physical column:', columnError.message);
        // Continue anyway, as metadata is more important
      }

      await client.query('COMMIT');

      const updatedTable = result.rows[0];

      res.status(201).json({
        message: 'Field added successfully',
        field: newField,
        table: {
          id: updatedTable.id,
          name: updatedTable.name,
          fields: updatedTable.schema_definition.fields || [],
          createdAt: updatedTable.created_at,
          updatedAt: updatedTable.updated_at
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Add field error:', error);
    res.status(500).json({
      error: 'Failed to add field',
      code: 'ADD_FIELD_ERROR'
    });
  }
});

// Update table (add/remove fields)
router.put('/:projectId/tables/:tableId', validateUUID('projectId'), validateUUID('tableId'), authenticateToken, async (req, res) => {
  try {
    const { projectId, tableId } = req.params;
    const { fields } = req.body;

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

    // Get current table
    const tableResult = await pool.query(
      'SELECT * FROM project_tables WHERE id = $1 AND project_id = $2',
      [tableId, projectId]
    );

    if (tableResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Table not found',
        code: 'TABLE_NOT_FOUND'
      });
    }

    const table = tableResult.rows[0];
    const currentFields = table.schema_definition.fields || [];

    // Update table schema
    const result = await pool.query(
      'UPDATE project_tables SET schema_definition = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify({ ...table.schema_definition, fields }), tableId]
    );

    const updatedTable = result.rows[0];

    res.json({
      message: 'Table updated successfully',
      table: {
        id: updatedTable.id,
        name: updatedTable.name,
        fields: updatedTable.schema_definition.fields || [],
        createdAt: updatedTable.created_at,
        updatedAt: updatedTable.updated_at
      }
    });

  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({
      error: 'Failed to update table',
      code: 'UPDATE_TABLE_ERROR'
    });
  }
});

// Delete table
router.delete('/:projectId/tables/:tableId', validateUUID('projectId'), validateUUID('tableId'), authenticateToken, async (req, res) => {
  try {
    const { projectId, tableId } = req.params;

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

    // Get table
    const tableResult = await pool.query(
      'SELECT name FROM project_tables WHERE id = $1 AND project_id = $2',
      [tableId, projectId]
    );

    if (tableResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Table not found',
        code: 'TABLE_NOT_FOUND'
      });
    }

    const tableName = tableResult.rows[0].name;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Drop physical table
      await TableManager.dropPhysicalTable(projectId, tableName);

      // Delete table metadata
      await client.query('DELETE FROM project_tables WHERE id = $1', [tableId]);

      await client.query('COMMIT');

      res.json({
        message: 'Table deleted successfully'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({
      error: 'Failed to delete table',
      code: 'DELETE_TABLE_ERROR'
    });
  }
});

export default router;