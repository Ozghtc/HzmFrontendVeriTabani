import { useMemo } from 'react';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiAdminProjects, useApiUsers } from '../../../hooks/useApiAdmin';
import { AdminStats } from '../types/adminTypes';

export const useAdminData = () => {
  const { state } = useDatabase();
  const { projects: backendProjects, loading: projectsLoading } = useApiAdminProjects();
  const { users: backendUsers, loading: usersLoading } = useApiUsers();

  const loading = projectsLoading || usersLoading;
  const users = backendUsers || [];
  const projects = backendProjects || [];
  const pricingPlans = state.pricingPlans || [];

  const stats: AdminStats = useMemo(() => {
    const totalTables = projects.reduce((total: number, project: any) => {
      return total + (project?.tableCount || 0);
    }, 0);

    const dataSize = (JSON.stringify({
      users,
      projects,
      state,
      plans: pricingPlans
    }).length / 1024).toFixed(0) + 'KB';

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u?.isActive).length,
      premiumUsers: users.filter(u => u?.subscriptionType !== 'free').length,
      totalPlans: pricingPlans.length,
      totalProjects: projects.length,
      totalTables,
      dataSize,
      activePlans: pricingPlans.filter(p => p?.isActive).length
    };
  }, [users, projects, pricingPlans, state]);

  return {
    loading,
    stats,
    user: state.user
  };
}; 