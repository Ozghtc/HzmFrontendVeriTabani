import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLogin from './components/auth/AdminLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProjectPanel from './components/panels/ProjectPanel';
import TablePanel from './components/panels/TablePanel';
import FieldPanel from './components/panels/FieldPanel';
import { DatabaseProvider } from './context/DatabaseContext';
import { BackendProvider } from './context/BackendContext';
import Layout from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectManagement from './pages/ProjectManagement';
import ProjectDataView from './pages/ProjectDataView';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import UserProjects from './pages/UserProjects';
import BackendDemo from './components/BackendDemo';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AdminAuthProvider>
        <BackendProvider>
          <DatabaseProvider>
            <Routes>
            {/* Admin Panel Routes */}
            <Route path="/admin-panel-0923/login" element={<AdminLogin />} />
            
            <Route
              path="/admin-panel-0923"
              element={
                <ProtectedRoute>
                  <Navigate to="/admin-panel-0923/users" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-panel-0923/tables"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-100">
                    <div className="container mx-auto px-4 py-8">
                      <TablePanel />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-panel-0923/fields"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-100">
                    <div className="container mx-auto px-4 py-8">
                      <FieldPanel />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-panel-0923/users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-panel-0923/user-projects/:userId"
              element={
                <ProtectedRoute>
                  <UserProjects />
                </ProtectedRoute>
              }
            />

            {/* Backend Demo Route */}
            <Route path="/backend-demo" element={<BackendDemo />} />

            {/* Redirect root to admin panel */}
            <Route path="/" element={<Navigate to="/admin-panel-0923" replace />} />

            <Route path="/login" element={<Login />} />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/user/:userId/:projectId"
              element={
                <ProtectedRoute>
                  <ProjectManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/user/:userId/:projectId/data"
              element={
                <ProtectedRoute>
                  <ProjectDataView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/user/:userId"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            </Routes>
          </DatabaseProvider>
        </BackendProvider>
      </AdminAuthProvider>
    </Router>
  );
};

export default App;