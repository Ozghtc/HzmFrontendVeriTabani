export const getUserName = (project: any, users: any[] = []) => {
  if (project?.userName) return project.userName;
  const user = users.find(u => u.id === project.userId);
  return user ? user.name : 'Bilinmeyen Kullanıcı';
};

export const getTotalTables = (project: any) => {
  return project?.tableCount || 0;
};

export const getTotalFields = (project: any) => {
  return 0; // Backend'de field count bilgisi yok
};

export const getFilteredProjects = (
  projects: any[],
  searchTerm: string,
  filterUser: string
) => {
  // ✅ Safe array handling - prevent undefined filter errors
  if (!projects || !Array.isArray(projects)) {
    console.log('⚠️ Projects array is undefined or not an array:', projects);
    return [];
  }
  
  return projects.filter(project => {
    if (!project) return false;
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser === 'all' || project.userId?.toString() === filterUser;
    return matchesSearch && matchesUser;
  });
};

export const calculateTotalTables = (projects: any[]): number => {
  return projects.reduce((total, project) => {
    return total + (project?.tableCount || 0);
  }, 0);
};

export const calculateActiveUsers = (projects: any[]): number => {
  return new Set(projects.filter(p => p?.userId).map(p => p.userId)).size;
}; 