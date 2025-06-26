import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectManagement from './pages/ProjectManagement';
import ProjectDataView from './pages/ProjectDataView';
import DatabaseUsers from './pages/DatabaseUsers';
import DatabaseProjects from './pages/DatabaseProjects';
import DatabaseState from './pages/DatabaseState';
import DatabasePricing from './pages/DatabasePricing';
import UpgradePlanPage from './pages/UpgradePlanPage';
import ApiTest from './pages/ApiTest';
import ApiProjects from './pages/ApiProjects';
import LocalStorageMigration from './pages/LocalStorageMigration';
import './App.css';

function App() {
  return (
    <DatabaseProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/api-test" element={<ApiTest />} />

          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/upgrade" element={
            <ProtectedRoute>
              <UpgradePlanPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          
          {/* Database Management Routes */}
          <Route path="/database/users" element={
            <AdminRoute>
              <DatabaseUsers />
            </AdminRoute>
          } />
          
          <Route path="/database/projects" element={
            <AdminRoute>
              <DatabaseProjects />
            </AdminRoute>
          } />
          
          <Route path="/database/state" element={
            <AdminRoute>
              <DatabaseState />
            </AdminRoute>
          } />
          
          <Route path="/database/pricing" element={
            <AdminRoute>
              <DatabasePricing />
            </AdminRoute>
          } />
          
          <Route path="/workspace" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-slate-50">
                <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
                  <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">Veri Tabanı Sistemi</h1>
                  </div>
                </header>
                <main className="container mx-auto p-4">
                  <Layout />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:projectId" element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:projectId/data" element={
            <ProtectedRoute>
              <ProjectDataView />
            </ProtectedRoute>
          } />
          
          {/* Redirect old routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DatabaseProvider>
  );
}

export default App;