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
import MathCalculator from './components/MathCalculator';
import AdvancedMathCalculator from './components/AdvancedMathCalculator';
import './pages/ApiProjects';

import './App.css';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/:id" element={<ProjectManagement />} />
      <Route path="/projects/:id/data" element={<ProjectDataView />} />
      <Route path="/database-users" element={<DatabaseUsers />} />
      <Route path="/database-projects" element={<DatabaseProjects />} />
      <Route path="/database-state" element={<DatabaseState />} />
      <Route path="/database-pricing" element={<DatabasePricing />} />
      <Route path="/upgrade-plan" element={<UpgradePlanPage />} />
      <Route path="/api-test" element={<ApiTest />} />
      
      {/* 🧮 PHASE 4 - MATEMATİK CALCULATOR */}
      <Route path="/math-calculator" element={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">HZMSoft Matematik Hesaplayıcı</h1>
              <p className="text-gray-600">Gelişmiş matematik işlemleri için profesyonel hesaplayıcı</p>
            </div>
            <MathCalculator />
          </div>
        </div>
      } />

      {/* 🔬 PHASE 4 - GELİŞMİŞ MATEMATİK HESAPLAYICI */}
      <Route path="/advanced-math" element={<AdvancedMathCalculator />} />

      {/* Protected routes */}
      <Route path="/protected" element={<ProtectedRoute><h1>Protected Route</h1></ProtectedRoute>} />
      <Route path="/admin-only" element={<AdminRoute><h1>Admin Only Route</h1></AdminRoute>} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <DatabaseProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </DatabaseProvider>
    </BrowserRouter>
  );
};

export default App; 