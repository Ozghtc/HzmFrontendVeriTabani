/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import React, { useState, useEffect } from 'react';
import { useApiProjects } from '../hooks/useApiProjects';
import { Field, FieldRelationship } from '../types';
import ProjectPanel from './panels/ProjectPanel';
import TablePanel from './panels/TablePanel';
import FieldPanel from './panels/field/FieldPanel';

const Layout: React.FC = () => {
  const { projects, loading: projectsLoading, fetchProjects } = useApiProjects();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [fields, setFields] = useState<Field[]>([]);

  // Auto-select first project when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  // Clear selected table when project changes
  useEffect(() => {
    setSelectedTable(null);
    setFields([]);
  }, [selectedProject]);

  // Load fields when table changes
  useEffect(() => {
    if (selectedTable) {
      setFields(selectedTable.fields || []);
    } else {
      setFields([]);
    }
  }, [selectedTable]);

  const handleSelectProject = (projectId: string) => {
    const project = projects.find((p: any) => p.id.toString() === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleSelectTable = (tableId: string) => {
    const table = selectedProject?.tables?.find((t: any) => t.id.toString() === tableId);
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
    setFields((prev: Field[]) => prev.map((field: Field) => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: prev.fields?.map((field: Field) => 
          field.id === fieldId ? { ...field, ...updates } : field
        ) || []
      }));
    }
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prev: Field[]) => prev.filter((field: Field) => field.id !== fieldId));
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: prev.fields?.filter((field: Field) => field.id !== fieldId) || []
      }));
    }
  };

  const handleReorderFields = (oldIndex: number, newIndex: number) => {
    setFields((prev: Field[]) => {
      const newFields = [...prev];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      return newFields;
    });
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => {
        const newFields = [...(prev.fields || [])];
        const [movedField] = newFields.splice(oldIndex, 1);
        newFields.splice(newIndex, 0, movedField);
        return { ...prev, fields: newFields };
      });
    }
  };

  const handleAddRelationship = (fieldId: string, relationship: FieldRelationship) => {
    setFields((prev: Field[]) => prev.map((field: Field) => 
      field.id === fieldId 
        ? { ...field, relationships: [...(field.relationships || []), relationship] }
        : field
    ));
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: prev.fields?.map((field: Field) => 
          field.id === fieldId 
            ? { ...field, relationships: [...(field.relationships || []), relationship] }
            : field
        ) || []
      }));
    }
  };

  const handleRemoveRelationship = (fieldId: string, relationshipId: string) => {
    setFields((prev: Field[]) => prev.map((field: Field) => 
      field.id === fieldId 
        ? { 
            ...field, 
            relationships: (field.relationships || []).filter((rel: FieldRelationship) => rel.id !== relationshipId)
          }
        : field
    ));
    
    // Update selected table's fields
    if (selectedTable) {
      setSelectedTable((prev: any) => ({
        ...prev,
        fields: prev.fields?.map((field: Field) => 
          field.id === fieldId 
            ? { 
                ...field, 
                relationships: (field.relationships || []).filter((rel: FieldRelationship) => rel.id !== relationshipId)
              }
            : field
        ) || []
      }));
    }
  };

  const handleProjectRefresh = async () => {
    console.log('🔄 Refreshing projects...');
    await fetchProjects();
    
    // Re-select the current project to get updated data
    if (selectedProject) {
      const updatedProject = projects.find((p: any) => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
        
        // Re-select the current table if exists
        if (selectedTable) {
          const updatedTable = (updatedProject as any).tables?.find((t: any) => t.id === selectedTable.id);
          if (updatedTable) {
            setSelectedTable(updatedTable);
            setFields(updatedTable.fields || []);
          }
        }
      }
    }
  };

  const handleTableCreated = async () => {
    await handleProjectRefresh();
  };

  const handleFieldsChanged = async () => {
    await handleProjectRefresh();
  };

  if (projectsLoading) {
    return <div className="p-4 text-center">Projeler yükleniyor...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-full">
          <ProjectPanel 
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
          />
          <TablePanel 
            selectedProject={selectedProject}
            selectedTable={selectedTable}
            onTableSelect={handleSelectTable}
            onTableCreated={handleTableCreated}
          />
          <FieldPanel
            selectedProject={selectedProject}
            selectedTable={selectedTable}
            fields={fields}
            onAddField={handleAddField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
            onReorderFields={handleReorderFields}
            onAddRelationship={handleAddRelationship}
            onRemoveRelationship={handleRemoveRelationship}
            onFieldsChanged={handleFieldsChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;