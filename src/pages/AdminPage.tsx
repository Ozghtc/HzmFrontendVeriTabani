import React from 'react';
import { useAdminData } from './admin/hooks/useAdminData';
import AdminGuard from './admin/components/AdminGuard';
import AdminLoading from './admin/components/AdminLoading';
import AdminHeader from './admin/components/AdminHeader';
import StatsCards from './admin/components/StatsCards';
import DatabaseManagementCards from './admin/components/DatabaseManagementCards';
import QuickActions from './admin/components/QuickActions';

const AdminPage = () => {
  const { loading, stats, user } = useAdminData();

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        
        <main className="container mx-auto p-4">
          <StatsCards stats={stats} />
          <DatabaseManagementCards stats={stats} />
          <QuickActions />
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminPage;