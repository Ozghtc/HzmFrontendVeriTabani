import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiProjects } from '../../../hooks/useApiProjects';
import { useApiUsers } from '../../../hooks/useApiAdmin';
import { apiClient } from '../../../utils/api';
import { AuthManager } from '../../../utils/api/utils/authUtils';

export const useProjectData = () => {
  const { id } = useParams();  // Route'da :id olarak tanımlandığı için
  const projectId = id; // Backward compatibility için
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
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://hzmbackendveritabani-production.up.railway.app/api/v1'}/admin/projects/${projectId}`, {
            headers: {
              ...authHeaders,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();
            const adminProject = result.data.project; // ✅ FIXED: data.project olarak düzeltildi
            
            console.log('✅ Admin project loaded successfully:', adminProject?.name || 'Unknown');
            console.log('📊 Admin project details:', adminProject);
            
            // Load tables for admin project too
            let projectTables = [];
            try {
              console.log('📋 Loading tables for admin project:', adminProject.id);
              const tablesResponse = await apiClient.tables.getTables(adminProject.id.toString());
              
              if (tablesResponse.success) {
                const tablesData = (tablesResponse.data as any).data?.tables || [];
                console.log('✅ Admin tables loaded:', tablesData.length, 'tables');
                
                projectTables = tablesData.map((table: any) => ({
                  id: table.id?.toString() || '',
                  name: table.name || table.tableName || '',
                  fields: (table.fields || []).map((field: any) => ({
                    id: field.id.toString(),
                    name: field.name,
                    type: field.type,
                    required: field.isRequired || false,
                    description: field.description || '',
                    validation: field.validation || {},
                    relationships: field.relationships || []
                  }))
                }));
              } else {
                console.log('❌ Failed to load admin tables:', tablesResponse.error);
              }
            } catch (tablesError) {
              console.error('💥 Error loading admin tables:', tablesError);
            }

            // Format project data for frontend
            const formattedProject = {
              id: adminProject.id,
              name: adminProject.name,
              description: adminProject.description,
              apiKey: adminProject.api_key || adminProject.apiKey,
              userId: adminProject.user_id || adminProject.userId,
              userEmail: adminProject.user_email || adminProject.userEmail,
              userName: adminProject.user_name || adminProject.userName,
              tableCount: projectTables.length,
              isPublic: adminProject.is_public || adminProject.isPublic || false,
              settings: adminProject.settings || {},
              createdAt: adminProject.created_at || adminProject.createdAt,
              updatedAt: adminProject.updated_at || adminProject.updatedAt,
              tables: projectTables
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
                fields: (table.fields || []).map((field: any) => ({
                  id: field.id.toString(),
                  name: field.name,
                  type: field.type,
                  required: field.isRequired || false,
                  description: field.description || '',
                  validation: field.validation || {},
                  relationships: field.relationships || []
                }))
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
    } else if (project.userName || project.userEmail) {
      // ✅ ADMIN BYPASS: Admin project'te userName ve userEmail direkt geliyorsa kullan
      projectOwner = {
        id: project.userId,
        name: project.userName,
        email: project.userEmail
      };
      console.log('✅ Admin project owner set:', projectOwner);
    } else if (project.userId) {
      // Use users from API instead of localStorage
      projectOwner = users.find((u: any) => u.id === project.userId);
      if (projectOwner) {
        console.log('✅ Project owner found from users API:', projectOwner);
      }
    }
  }

  const navigateToProjects = () => {
    // ✅ Admin context kontrolü - query parameter'dan geldiği sayfayı anla
    const urlParams = new URLSearchParams(window.location.search);
    const fromAdmin = urlParams.get('from') === 'admin';
    
    if (fromAdmin) {
      console.log('🔙 Returning to admin panel from project management');
      navigate('/database/projects');
    } else {
      console.log('🔙 Returning to user projects from project management');
      navigate('/projects');
    }
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