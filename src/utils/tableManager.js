import { pool } from '../database/connection.js';

export class TableManager {
  /**
   * Create a physical table in the database
   */
  static async createPhysicalTable(projectId, tableName, fields) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Generate table name with project prefix
      const physicalTableName = `project_${projectId.replace(/-/g, '_')}_${tableName}`;
      
      // Build CREATE TABLE query
      let createQuery = `CREATE TABLE ${physicalTableName} (`;
      createQuery += 'id UUID PRIMARY KEY DEFAULT gen_random_uuid(),';
      
      // Add custom fields
      const fieldDefinitions = fields.map(field => {
        let definition = `${field.name} `;
        
        // Map field types to PostgreSQL types
        switch (field.type) {
          case 'string':
            definition += field.validation?.maxLength 
              ? `VARCHAR(${field.validation.maxLength})` 
              : 'TEXT';
            break;
          case 'number':
            definition += 'NUMERIC';
            break;
          case 'boolean':
            definition += 'BOOLEAN';
            break;
          case 'date':
            definition += 'TIMESTAMP WITH TIME ZONE';
            break;
          case 'object':
          case 'array':
            definition += 'JSONB';
            break;
          case 'currency':
            definition += 'DECIMAL(15,2)';
            break;
          case 'weight':
            definition += 'DECIMAL(10,3)';
            break;
          default:
            definition += 'TEXT';
        }
        
        // Add NOT NULL constraint if required
        if (field.required) {
          definition += ' NOT NULL';
        }
        
        return definition;
      });
      
      createQuery += fieldDefinitions.join(', ');
      createQuery += ', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()';
      createQuery += ', updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()';
      createQuery += ')';
      
      // Execute table creation
      await client.query(createQuery);
      
      // Create indexes for better performance
      await client.query(`CREATE INDEX idx_${physicalTableName}_created_at ON ${physicalTableName}(created_at)`);
      
      await client.query('COMMIT');
      
      return physicalTableName;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Drop a physical table from the database
   */
  static async dropPhysicalTable(projectId, tableName) {
    const physicalTableName = `project_${projectId.replace(/-/g, '_')}_${tableName}`;
    
    try {
      await pool.query(`DROP TABLE IF EXISTS ${physicalTableName} CASCADE`);
      return true;
    } catch (error) {
      console.error('Error dropping table:', error);
      throw error;
    }
  }

  /**
   * Add a column to an existing table
   */
  static async addColumn(projectId, tableName, field) {
    const physicalTableName = `project_${projectId.replace(/-/g, '_')}_${tableName}`;
    
    let columnDefinition = `${field.name} `;
    
    // Map field types to PostgreSQL types
    switch (field.type) {
      case 'string':
        columnDefinition += field.validation?.maxLength 
          ? `VARCHAR(${field.validation.maxLength})` 
          : 'TEXT';
        break;
      case 'number':
        columnDefinition += 'NUMERIC';
        break;
      case 'boolean':
        columnDefinition += 'BOOLEAN';
        break;
      case 'date':
        columnDefinition += 'TIMESTAMP WITH TIME ZONE';
        break;
      case 'object':
      case 'array':
        columnDefinition += 'JSONB';
        break;
      case 'currency':
        columnDefinition += 'DECIMAL(15,2)';
        break;
      case 'weight':
        columnDefinition += 'DECIMAL(10,3)';
        break;
      default:
        columnDefinition += 'TEXT';
    }
    
    try {
      await pool.query(`ALTER TABLE ${physicalTableName} ADD COLUMN ${columnDefinition}`);
      return true;
    } catch (error) {
      console.error('Error adding column:', error);
      throw error;
    }
  }

  /**
   * Remove a column from an existing table
   */
  static async removeColumn(projectId, tableName, fieldName) {
    const physicalTableName = `project_${projectId.replace(/-/g, '_')}_${tableName}`;
    
    try {
      await pool.query(`ALTER TABLE ${physicalTableName} DROP COLUMN IF EXISTS ${fieldName}`);
      return true;
    } catch (error) {
      console.error('Error removing column:', error);
      throw error;
    }
  }

  /**
   * Get physical table name
   */
  static getPhysicalTableName(projectId, tableName) {
    return `project_${projectId.replace(/-/g, '_')}_${tableName}`;
  }

  /**
   * Check if table exists
   */
  static async tableExists(projectId, tableName) {
    const physicalTableName = this.getPhysicalTableName(projectId, tableName);
    
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )
      `, [physicalTableName]);
      
      return result.rows[0].exists;
    } catch (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
  }

  /**
   * Get table schema information
   */
  static async getTableSchema(projectId, tableName) {
    const physicalTableName = this.getPhysicalTableName(projectId, tableName);
    
    try {
      const result = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [physicalTableName]);
      
      return result.rows;
    } catch (error) {
      console.error('Error getting table schema:', error);
      throw error;
    }
  }
}