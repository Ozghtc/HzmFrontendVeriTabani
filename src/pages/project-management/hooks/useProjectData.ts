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
        console.log('🚀 Looking for project in frontend list first...');
        const parsedProjectId = Number(projectId);
        const frontendProject = projects.find(p => {
          return p.id === parsedProjectId || p.id.toString() === projectId;
        });
        
        if (frontendProject) {
          console.log('✅ Found project in frontend list:', frontendProject);
          setProject(frontendProject);
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: frontendProject } });
          setLoading(false);
          
          // Background update from backend
          try {
            const response = await apiClient.getProject(projectId);
            if (response.success && response.data) {
              console.log('✅ Backend data received, updating...');
              setProject(response.data);
              dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: response.data } });
            }
          } catch (backendError) {
            console.log('ℹ️ Backend error, keeping frontend data:', backendError);
          }
          return;
        }

        if (projectsLoading) {
          console.log('⏳ Projects still loading, waiting...');
          setLoading(false);
          return;
        }

        // Try backend only
        console.log('🔄 Project not in frontend list, trying backend only...');
        const response = await apiClient.getProject(projectId);
        
        if (response.success && response.data) {
          console.log('✅ Project loaded from backend only:', response.data);
          setProject(response.data);
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: response.data } });
        } else {
          console.error('❌ Project not found anywhere');
          setError(response.error || 'Project not found');
        }
        
      } catch (error: any) {
        console.error('Failed to load project:', error);
        setError(error.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

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