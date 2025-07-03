import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiProjects } from '../../../hooks/useApiProjects';
import { apiClient } from '../../../utils/api';

export const useProjectData = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDatabase();
  const { projects, loading: projectsLoading } = useApiProjects();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Frontend-first approach
        const parsedProjectId = Number(projectId);
        console.log('Looking for project:', parsedProjectId, 'in', projects.length, 'projects');
        
        const frontendProject = projects.find(p => {
          return p.id === parsedProjectId || p.id.toString() === projectId;
        });
        
        if (frontendProject) {
          console.log('✅ Found project:', frontendProject.name);
          setProject(frontendProject as any);
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId: parsedProjectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: frontendProject as any } });
          setLoading(false);
          return;
        }

        if (projectsLoading) {
          console.log('Projects still loading...');
          // Don't set loading false here, keep waiting
          return;
        }

        // Only if projects have loaded and we still don't find it
        if (projects.length === 0) {
          console.log('❌ No projects loaded yet, wait for them');
          return;
        }

        console.log('❌ Project not found in frontend list');
        setError('Project not found');
        setLoading(false);
        
      } catch (error: any) {
        console.error('Failed to load project:', error);
        setError(error.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, projects, projectsLoading, dispatch]);  // ✅ FIXED - include all dependencies

  // Find project owner
  let projectOwner = null;
  if (project) {
    if (project.owner) {
      projectOwner = project.owner;
    } else if (project.userId) {
      const users = JSON.parse(localStorage.getItem('database_users') || '[]');
      projectOwner = users.find((u: any) => u.id === project.userId);
    }
  }

  return {
    project,
    projectOwner,
    loading,
    error,
    currentUser: state.user,
    navigateToProjects: () => navigate('/projects')
  };
}; 