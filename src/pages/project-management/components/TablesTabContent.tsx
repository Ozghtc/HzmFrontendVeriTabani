import React, { useState, useEffect } from 'react';
import TablePanel from '../../../components/panels/TablePanel';
import FieldPanel from '../../../components/panels/FieldPanel';
import { Field } from '../../../types';

interface TablesTabContentProps {
  project: any;
}

const TablesTabContent: React.FC<TablesTabContentProps> = ({ project }) => {
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [fields, setFields] = useState<Field[]>([]);

  // Auto-select first table when project loads
  useEffect(() => {
    if (project?.tables?.length > 0 && !selectedTable) {
      setSelectedTable(project.tables[0]);
    }
  }, [project, selectedTable]);

  // Load fields when table changes
  useEffect(() => {
    if (selectedTable) {
      setFields(selectedTable.fields || []);
    } else {
      setFields([]);
    }
  }, [selectedTable]);

  const handleSelectTable = (tableId: string) => {
    const table = project?.tables?.find((t: any) => t.id.toString() === tableId);
    if (table) {
      setSelectedTable(table);
    }
  };

  // Field management callbacks
  const handleAddField = (field: Field) => {
    setFields((prev: Field[]) => [...prev, field]);
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: [...(prev.fields || []), field]
      }));
    }
  };

  const handleUpdateField = (fieldId: string, updates: Partial<Field>) => {
    setFields((prev: Field[]) => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: prev.fields.map((field: Field) => 
          field.id === fieldId ? { ...field, ...updates } : field
        )
      }));
    }
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prev: Field[]) => prev.filter(field => field.id !== fieldId));
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: prev.fields.filter((field: Field) => field.id !== fieldId)
      }));
    }
  };

  const handleReorderFields = (oldIndex: number, newIndex: number) => {
    const newFields = [...fields];
    const [reorderedField] = newFields.splice(oldIndex, 1);
    newFields.splice(newIndex, 0, reorderedField);
    
    setFields(newFields);
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: newFields
      }));
    }
  };

  const handleAddRelationship = (fieldId: string, relationship: any) => {
    handleUpdateField(fieldId, { 
      relationships: [...(fields.find(f => f.id === fieldId)?.relationships || []), relationship]
    });
  };

  const handleRemoveRelationship = (fieldId: string, relationshipId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field?.relationships) {
      handleUpdateField(fieldId, { 
        relationships: field.relationships.filter(r => r.id !== relationshipId)
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TablePanel 
        selectedProject={project}
        selectedTable={selectedTable}
        onTableSelect={handleSelectTable}
      />
      <FieldPanel 
        selectedProject={project}
        selectedTable={selectedTable}
        fields={fields}
        onAddField={handleAddField}
        onUpdateField={handleUpdateField}
        onDeleteField={handleDeleteField}
        onReorderFields={handleReorderFields}
        onAddRelationship={handleAddRelationship}
        onRemoveRelationship={handleRemoveRelationship}
      />
    </div>
  );
};

export default TablesTabContent; 