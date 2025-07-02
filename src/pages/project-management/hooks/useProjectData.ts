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
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId: parsedProjectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: frontendProject } });
          setLoading(false);
          
          // Background update from backend
          try {
            const response = await apiClient.projects.getProject(projectId);
            if (response.success && response.data) {
              console.log('✅ Backend data received, updating...');
              // Transform backend data to frontend format
              const transformedProject = {
                ...response.data,
                userId: Number((response.data as any).userId),
                tables: (frontendProject as any).tables || [],
                apiKeys: (frontendProject as any).apiKeys || [],
                isPublic: (frontendProject as any).isPublic || false,
                settings: (frontendProject as any).settings || {
                  allowApiAccess: true,
                  requireAuth: false,
                  maxRequestsPerMinute: 100,
                  enableWebhooks: false
                }
              } as any;
              setProject(transformedProject);
              dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: transformedProject } });
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
        const response = await apiClient.projects.getProject(projectId);
        
        if (response.success && response.data) {
          console.log('✅ Project loaded from backend only:', response.data);
          // Transform backend data to frontend format
          const transformedProject = {
            ...response.data,
            userId: Number((response.data as any).userId),
            tables: [],
            apiKeys: [],
            isPublic: false,
            settings: {
              allowApiAccess: true,
              requireAuth: false,
              maxRequestsPerMinute: 100,
              enableWebhooks: false
            }
          } as any;
          setProject(transformedProject);
          dispatch({ type: 'SELECT_PROJECT', payload: { projectId: parsedProjectId } });
          dispatch({ type: 'SET_SELECTED_PROJECT', payload: { project: transformedProject } });
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