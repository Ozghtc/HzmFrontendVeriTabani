import React, { useState, useEffect } from 'react';
import TablePanel from '../../../components/panels/TablePanel';
import FieldPanel from '../../../components/panels/FieldPanel';
import { Field } from '../../../types';

interface TablesTabContentProps {
  project: any;
  onRefresh: () => Promise<void>;
}

const TablesTabContent: React.FC<TablesTabContentProps> = ({ project, onRefresh }) => {
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [fields, setFields] = useState<Field[]>([]);

  // Auto-select first table when project loads - prevent infinite loop
  useEffect(() => {
    if (project?.tables?.length > 0 && !selectedTable) {
      console.log('🔄 Auto-selecting first table:', project.tables[0]);
      setSelectedTable(project.tables[0]);
    }
  }, [project?.tables?.length, project?.id]); // Depend on table count and project ID

  // Load fields when table changes
  useEffect(() => {
    console.log('🔄 TablesTabContent: selectedTable changed:', selectedTable);
    if (selectedTable) {
      setFields(selectedTable.fields || []);
      console.log('📋 Fields loaded:', selectedTable.fields || []);
    } else {
      setFields([]);
      console.log('📋 No table selected, clearing fields');
    }
  }, [selectedTable]);

  const handleSelectTable = (tableId: string) => {
    console.log('🎯 TablesTabContent: Selecting table:', tableId, typeof tableId);
    console.log('📋 Available tables:', project?.tables?.map((t: any) => ({ 
      id: t.id, 
      idType: typeof t.id,
      name: t.name 
    })));
    
    // Try both string and number comparison
    const table = project?.tables?.find((t: any) => 
      t.id.toString() === tableId || t.id === Number(tableId)
    );
    console.log('🔍 Found table:', table);
    
    if (table) {
      setSelectedTable(table);
      console.log('✅ Selected table set:', table);
    } else {
      console.log('❌ Table not found for id:', tableId);
    }
  };

  const handleTableCreated = async (newTable?: any) => {
    console.log('🎉 Table created, refreshing project data...');
    await onRefresh();
    
    // Auto-select the newly created table after refresh
    if (newTable && newTable.id) {
      console.log('🎯 Auto-selecting newly created table in TablesTabContent:', newTable.name);
      setTimeout(() => {
        handleSelectTable(newTable.id.toString());
      }, 100); // Small delay to ensure refresh is complete
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

  console.log('🎨 TablesTabContent render:', {
    project: project?.name,
    selectedTable: selectedTable?.name,
    fieldsCount: fields.length
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TablePanel 
        selectedProject={project}
        selectedTable={selectedTable}
        onTableSelect={handleSelectTable}
        onTableCreated={handleTableCreated}
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