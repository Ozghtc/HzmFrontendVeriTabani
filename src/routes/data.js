import express from 'express';
import { pool } from '../database/connection.js';
import { authenticateToken, authenticateApiKey, checkPermission } from '../middleware/auth.js';
import { validateUUID, validatePagination } from '../middleware/validation.js';
import { TableManager } from '../utils/tableManager.js';

const router = express.Router();

// Get all data from a table
router.get('/:projectId/tables/:tableId/data', 
  validateUUID('projectId'), 
  validateUUID('tableId'), 
  authenticateToken, 
  validatePagination,
  async (req, res) => {
    try {
      const { projectId, tableId } = req.params;
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

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

      // Get table metadata
      const tableResult = await pool.query(
        'SELECT name, schema_definition FROM project_tables WHERE id = $1 AND project_id = $2',
        [tableId, projectId]
      );

      if (tableResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Table not found',
          code: 'TABLE_NOT_FOUND'
        });
      }

      const table = tableResult.rows[0];
      const physicalTableName = TableManager.getPhysicalTableName(projectId, table.name);

      // Check if physical table exists
      const tableExists = await TableManager.tableExists(projectId, table.name);
      if (!tableExists) {
        return res.status(404).json({
          error: 'Physical table not found',
          code: 'PHYSICAL_TABLE_NOT_FOUND'
        });
      }

      // Get data with pagination
      const dataResult = await pool.query(
        `SELECT * FROM ${physicalTableName} 
         ORDER BY ${sortBy} ${sortOrder.toUpperCase()} 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      // Get total count
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM ${physicalTableName}`
      );

      res.json({
        data: dataResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        },
        table: {
          id: tableId,
          name: table.name,
          fields: table.schema_definition.fields || []
        }
      });

    } catch (error) {
      console.error('Get table data error:', error);
      res.status(500).json({
        error: 'Failed to fetch table data',
        code: 'FETCH_DATA_ERROR'
      });
    }
  }
);

// Get data via API key
router.get('/:projectId/tables/:tableId/data/api', 
  validateUUID('projectId'), 
  validateUUID('tableId'), 
  authenticateApiKey, 
  checkPermission('read'),
  validatePagination,
  async (req, res) => {
    try {
      const { projectId, tableId } = req.params;
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
      const offset = (page - 1) * limit;

      if (req.project.id !== projectId) {
        return res.status(403).json({
          error: 'Access denied to this project',
          code: 'PROJECT_ACCESS_DENIED'
        });
      }

      // Get table metadata
      const tableResult = await pool.query(
        'SELECT name, schema_definition FROM project_tables WHERE id = $1 AND project_id = $2',
        [tableId, projectId]
      );

      if (tableResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Table not found',
          code: 'TABLE_NOT_FOUND'
        });
      }

      const table = tableResult.rows[0];
      const physicalTableName = TableManager.getPhysicalTableName(projectId, table.name);

      // Check if physical table exists
      const tableExists = await TableManager.tableExists(projectId, table.name);
      if (!tableExists) {
        return res.status(404).json({
          error: 'Physical table not found',
          code: 'PHYSICAL_TABLE_NOT_FOUND'
        });
      }

      // Get data with pagination
      const dataResult = await pool.query(
        `SELECT * FROM ${physicalTableName} 
         ORDER BY ${sortBy} ${sortOrder.toUpperCase()} 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      // Get total count
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM ${physicalTableName}`
      );

      res.json({
        data: dataResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(countResult.rows[0].count / limit)
        },
        table: {
          id: tableId,
          name: table.name,
          fields: table.schema_definition.fields || []
        }
      });

    } catch (error) {
      console.error('Get table data via API error:', error);
      res.status(500).json({
        error: 'Failed to fetch table data',
        code: 'FETCH_DATA_ERROR'
      });
    }
  }
);

// Create new record
router.post('/:projectId/tables/:tableId/data', 
  validateUUID('projectId'), 
  validateUUID('tableId'), 
  authenticateToken,
  async (req, res) => {
    try {
      const { projectId, tableId } = req.params;
      const recordData = req.body;

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

      // Get table metadata
      const tableResult = await pool.query(
        'SELECT name, schema_definition FROM project_tables WHERE id = $1 AND project_id = $2',
        [tableId, projectId]
      );

      if (tableResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Table not found',
          code: 'TABLE_NOT_FOUND'
        });
      }

      const table = tableResult.rows[0];
      const physicalTableName = TableManager.getPhysicalTableName(projectId, table.name);
      const fields = table.schema_definition.fields || [];

      // Validate required fields
      for (const field of fields) {
        if (field.required && (recordData[field.name] === undefined || recordData[field.name] === null)) {
          return res.status(400).json({
            error: `Required field '${field.name}' is missing`,
            code: 'MISSING_REQUIRED_FIELD',
            field: field.name
          });
        }
      }

      // Build insert query
      const fieldNames = Object.keys(recordData).filter(key => 
        fields.some(field => field.name === key)
      );
      
      if (fieldNames.length === 0) {
        return res.status(400).json({
          error: 'No valid fields provided',
          code: 'NO_VALID_FIELDS'
        });
      }

      const placeholders = fieldNames.map((_, index) => `$${index + 1}`).join(', ');
      const values = fieldNames.map(name => recordData[name]);

      const result = await pool.query(
        `INSERT INTO ${physicalTableName} (${fieldNames.join(', ')}) 
         VALUES (${placeholders}) 
         RETURNING *`,
        values
      );

      res.status(201).json({
        message: 'Record created successfully',
        record: result.rows[0]
      });

    } catch (error) {
      console.error('Create record error:', error);
      res.status(500).json({
        error: 'Failed to create record',
        code: 'CREATE_RECORD_ERROR'
      });
    }
  }
);

// Create record via API key
router.post('/:projectId/tables/:tableId/data/api', 
  validateUUID('projectId'), 
  validateUUID('tableId'), 
  authenticateApiKey,
  checkPermission('write'),
  async (req, res) => {
    try {
      const { projectId, tableId } = req.params;
      const recordData = req.body;

      if (req.project.id !== projectId) {
        return res.status(403).json({
          error: 'Access denied to this project',
          code: 'PROJECT_ACCESS_DENIED'
        });
      }

      // Get table metadata
      const tableResult = await pool.query(
        'SELECT name, schema_definition FROM project_tables WHERE id = $1 AND project_id = $2',
        [tableId, projectId]
      );

      if (tableResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Table not found',
          code: 'TABLE_NOT_FOUND'
        });
      }

      const table = tableResult.rows[0];
      const physicalTableName = TableManager.getPhysicalTableName(projectId, table.name);
      const fields = table.schema_definition.fields || [];

      // Validate required fields
      for (const field of fields) {
        if (field.required && (recordData[field.name] === undefined || recordData[field.name] === null)) {
          return res.status(400).json({
            error: `Required field '${field.name}' is missing`,
            code: 'MISSING_REQUIRED_FIELD',
            field: field.name
          });
        }
      }

      // Build insert query
      const fieldNames = Object.keys(recordData).filter(key => 
        fields.some(field => field.name === key)
      );
      
      if (fieldNames.length === 0) {
        return res.status(400).json({
          error: 'No valid fields provided',
          code: 'NO_VALID_FIELDS'
        });
      }

      const placeholders = fieldNames.map((_, index) => `$${index + 1}`).join(', ');
      const values = fieldNames.map(name => recordData[name]);

      const result = await pool.query(
        `INSERT INTO ${physicalTableName} (${fieldNames.join(', ')}) 
         VALUES (${placeholders}) 
         RETURNING *`,
        values
      );

      res.status(201).json({
        message: 'Record created successfully',
        record: result.rows[0]
      });

    } catch (error) {
      console.error('Create record via API error:', error);
      res.status(500).json({
        error: 'Failed to create record',
        code: 'CREATE_RECORD_ERROR'
      });
    }
  }
);

// Update record
router.put('/:projectId/tables/:tableId/data/:recordId', 
  validateUUID('projectId'), 
  validateUUID('tableId'), 
  validateUUID('recordId'),
  authenticateToken,
  async (req, res) => {
    try {
      const { projectId, tableId, recordId } = req.params;
      const updateData = req.body;

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

      // Get table metadata
      const tableResult = await pool.query(
        'SELECT name, schema_definition FROM project_tables WHERE id = $1 AND project_id = $2',
        [tableId, projectId]
      );

      if (tableResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Table not found',
          code: 'TABLE_NOT_FOUND'
        });
      }

      const table = tableResult.rows[0];
      const physicalTableName = TableManager.getPhysicalTableName(projectId, table.name);
      const fields = table.schema_definition.fields || [];

      // Build update query
      const fieldNames = Object.keys(updateData).filter(key => 
        fields.some(field => field.name === key)
      );
      
      if (fieldNames.length === 0) {
        return res.status(400).json({
          error: 'No valid fields provided',
          code: 'NO_VALID_FIELDS'
        });
      }

      const setClause = fieldNames.map((name, index) => `${name} = $${index + 1}`).join(', ');
      const values = fieldNames.map(name => updateData[name]);
      values.push(recordId);

      const result = await pool.query(
        `UPDATE ${physicalTableName} 
         SET ${setClause}, updated_at = NOW() 
         WHERE id = $${values.length} 
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Record not found',
          code: 'RECORD_NOT_FOUND'
        });
      }

      res.json({
        message: 'Record updated successfully',
        record: result.rows[0]
      });

    } catch (error) {
      console.error('Update record error:', error);
      res.status(500).json({
        error: 'Failed to update record',
        code: 'UPDATE_RECORD_ERROR'
      });
    }
  }
);

// Delete record
router.delete('/:projectId/tables/:tableId/data/:recordId', 
  validateUUID('projectId'), 
  validateUUID('tableId'), 
  validateUUID('recordId'),
  authenticateToken,
  async (req, res) => {
    try {
      const { projectId, tableId, recordId } = req.params;

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

      // Get table metadata
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

      const table = tableResult.rows[0];
      const physicalTableName = TableManager.getPhysicalTableName(projectId, table.name);

      const result = await pool.query(
        `DELETE FROM ${physicalTableName} WHERE id = $1 RETURNING id`,
        [recordId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Record not found',
          code: 'RECORD_NOT_FOUND'
        });
      }

      res.json({
        message: 'Record deleted successfully',
        deletedId: result.rows[0].id
      });

    } catch (error) {
      console.error('Delete record error:', error);
      res.status(500).json({
        error: 'Failed to delete record',
        code: 'DELETE_RECORD_ERROR'
      });
    }
  }
);

export default router;