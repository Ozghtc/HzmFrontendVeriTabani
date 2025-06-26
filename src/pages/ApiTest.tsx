import React, { useState } from 'react';
import { apiClient } from '../utils/api';

const ApiTest = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const testRegister = async () => {
    setLoading(true);
    try {
      const result = await apiClient.register({
        name: 'Frontend Test User',
        email: 'frontend@test.com',
        password: '123456'
      });
      setResponse(result);
      if (result.success && (result.data as any)?.token) {
        localStorage.setItem('auth_token', (result.data as any).token);
        setToken((result.data as any).token);
      }
    } catch (error) {
      setResponse({ error: 'Network error' });
    }
    setLoading(false);
  };

  const testCreateProject = async () => {
    setLoading(true);
    try {
      const result = await apiClient.createProject({
        name: 'Frontend Test Project',
        description: 'Created from React frontend'
      });
      setResponse(result);
    } catch (error) {
      setResponse({ error: 'Network error' });
    }
    setLoading(false);
  };

  const testGetProjects = async () => {
    setLoading(true);
    try {
      const result = await apiClient.getProjects();
      setResponse(result);
    } catch (error) {
      setResponse({ error: 'Network error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend API Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testRegister}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Test Register
          </button>
          
          <button
            onClick={testCreateProject}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Test Create Project
          </button>
          
          <button
            onClick={testGetProjects}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            Test Get Projects
          </button>
        </div>

        {token && (
          <div className="mb-4 p-4 bg-green-100 rounded">
            <strong>Auth Token:</strong> {token.substring(0, 50)}...
          </div>
        )}

        {loading && (
          <div className="mb-4 p-4 bg-blue-100 rounded">
            Loading...
          </div>
        )}

        {response && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest; 