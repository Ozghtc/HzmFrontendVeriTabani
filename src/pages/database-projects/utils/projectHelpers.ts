export const getUserName = (project: any) => {
  return project?.userName || 'Bilinmeyen Kullanıcı';
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