import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiProjects } from '../../../hooks/useApiProjects';
import { useApiUsers } from '../../../hooks/useApiAdmin';
import { apiClient } from '../../../utils/api';
import { AuthManager } from '../../../utils/api/utils/authUtils';

export const useProjectData = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { state } = useDatabase();
  const { projects, loading: projectsLoading } = useApiProjects();
  const { users } = useApiUsers();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ ADMIN BYPASS: Admin ise backend'den direkt single project API'sini çağır
      if (state.user?.isAdmin) {
        console.log('🔐 Admin access detected - fetching project directly from backend');
        
        try {
          const authHeaders = AuthManager.getAuthHeaders();
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackandveritabani-production-c660.up.railway.app/api/v1'}/admin/projects/${projectId}`, {
            headers: {
              ...authHeaders,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();
            const adminProject = result.data;
            
            console.log('✅ Admin project loaded successfully:', adminProject.name);
            
            // Format project data for frontend
            const formattedProject = {
              id: adminProject.id,
              name: adminProject.name,
              description: adminProject.description,
              apiKey: adminProject.apiKey,
              userId: adminProject.userId,
              userEmail: adminProject.userEmail,
              userName: adminProject.userName,
              tableCount: adminProject.tableCount,
              isPublic: adminProject.isPublic,
              settings: adminProject.settings || {},
              createdAt: adminProject.createdAt,
              updatedAt: adminProject.updatedAt,
              tables: adminProject.tables || []
            };

            setProject(formattedProject);
            setLoading(false);
            return;
          } else {
            console.error('❌ Admin project API failed:', response.status);
            throw new Error(`Admin project API failed: ${response.status}`);
          }
        } catch (adminError: any) {
          console.error('💥 Admin project load error:', adminError);
          setError('Admin project load failed: ' + adminError.message);
          setLoading(false);
          return;
        }
      }

      // ✅ NORMAL USER: Frontend-first approach
      const parsedProjectId = Number(projectId);
      console.log('Looking for project:', parsedProjectId, 'in', projects.length, 'projects');
      
      const frontendProject = projects.find(p => {
        return p.id === parsedProjectId || p.id.toString() === projectId;
      });
      
      if (frontendProject) {
        console.log('✅ Found project:', frontendProject.name);
        
        // Load tables for this project
        try {
          console.log('📋 Loading tables for project:', frontendProject.id);
          const tablesResponse = await apiClient.tables.getTables(frontendProject.id.toString());
          
          if (tablesResponse.success) {
            const tablesData = (tablesResponse.data as any).data?.tables || [];
            console.log('✅ Tables loaded:', tablesData.length, 'tables');
            
            // Combine project with tables
            const projectWithTables = {
              ...frontendProject,
              tables: tablesData.map((table: any) => ({
                id: table.id?.toString() || '',
                name: table.name || table.tableName || '',
                fields: table.fields || []
              }))
            };
            
            setProject(projectWithTables as any);
          } else {
            console.log('❌ Failed to load tables:', tablesResponse.error);
            // Set project without tables
            setProject({ ...frontendProject, tables: [] } as any);
          }
        } catch (tablesError) {
          console.error('💥 Error loading tables:', tablesError);
          // Set project without tables
          setProject({ ...frontendProject, tables: [] } as any);
        }
        
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

  const refreshProject = async () => {
    console.log('🔄 Refreshing project data...');
    await loadProject();
  };

  useEffect(() => {
    loadProject();
  }, [projectId, projects, projectsLoading, state.user?.isAdmin]);

  // Find project owner using API
  let projectOwner = null;
  if (project) {
    if (project.owner) {
      projectOwner = project.owner;
    } else if (project.userId) {
      // Use users from API instead of localStorage
      projectOwner = users.find((u: any) => u.id === project.userId);
    }
  }

  const navigateToProjects = () => {
    navigate('/projects');
  };

  return {
    project,
    projectOwner,
    loading,
    error,
    projects,
    setProject,
    refreshProject,
    currentUser: state.user,
    navigateToProjects
  };
}; 