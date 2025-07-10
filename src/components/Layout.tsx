import React, { useState, useEffect } from 'react';
import { useApiProjects } from '../hooks/useApiProjects';
import ProjectPanel from './panels/ProjectPanel';
import TablePanel from './panels/TablePanel';
import FieldPanel from './panels/FieldPanel';

const Layout: React.FC = () => {
  const { projects, loading: projectsLoading } = useApiProjects();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);

  // Auto-select first project when projects load
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  // Clear selected table when project changes
  useEffect(() => {
    setSelectedTable(null);
  }, [selectedProject]);

  const handleSelectProject = (projectId: string) => {
    const project = projects.find(p => p.id.toString() === projectId);
    setSelectedProject(project || null);
  };

  const handleSelectTable = (tableId: string) => {
    if (selectedProject) {
      const table = selectedProject.tables?.find((t: any) => t.id.toString() === tableId);
      setSelectedTable(table || null);
    }
  };

  if (projectsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProjectPanel 
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
      />
      <TablePanel 
        selectedProject={selectedProject}
        selectedTable={selectedTable}
        onTableSelect={handleSelectTable}
      />
      <FieldPanel />
    </div>
  );
};

export default Layout;