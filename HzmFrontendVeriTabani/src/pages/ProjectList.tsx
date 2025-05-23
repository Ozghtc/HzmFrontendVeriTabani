import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { Database, ArrowLeft, Table, FileText, PlusCircle, Eye, Trash2, ClipboardCopy } from 'lucide-react';

const ProjectList = () => {
  const { state, dispatch } = useDatabase();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState('');
  const [deleteInput, setDeleteInput] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      dispatch({ type: 'ADD_PROJECT', payload: { name: newProjectName } });
      setNewProjectName('');
    }
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    setDeleteProjectId(projectId);
    setDeleteProjectName(projectName);
    setDeleteInput('');
  };

  const confirmDeleteProject = () => {
    if (deleteInput === deleteProjectName && deleteProjectId) {
      dispatch({ type: 'DELETE_PROJECT', payload: { projectId: deleteProjectId } });
      setDeleteProjectId(null);
      setDeleteProjectName('');
      setDeleteInput('');
    }
  };

  const cancelDeleteProject = () => {
    setDeleteProjectId(null);
    setDeleteProjectName('');
    setDeleteInput('');
  };

  function generateApiKey() {
    // Basit bir random key (gerçek backend'de daha güvenli olmalı)
    return 'vt_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Kayıtlı Projeler</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <form onSubmit={handleAddProject} className="mb-6">
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Yeni proje adı"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Proje Ekle
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">API Key:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded select-all">
                  {project.apiKey || generateApiKey()}
                </code>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => navigator.clipboard.writeText(project.apiKey || generateApiKey())}
                  title="Kopyala"
                >
                  <ClipboardCopy size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Database className="text-blue-600 mr-2" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <button
                    onClick={() => navigate(`/projects/${project.id}/data`)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
                  >
                    <Eye size={16} className="mr-1.5" />
                    Verileri Göster
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors flex items-center text-sm"
                  >
                    <Table size={16} className="mr-1.5" />
                    Tablo Ekle
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center ml-4"
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    title="Projeyi Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Table className="mr-2" size={18} />
                  <span>{project.tables.length} Tablo</span>
                </div>
                
                <div className="space-y-2">
                  {project.tables.map(table => (
                    <div
                      key={table.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <div className="flex items-center">
                        <Table className="text-gray-500 mr-2" size={16} />
                        <span className="text-sm font-medium text-gray-700">{table.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="text-gray-400 mr-1" size={14} />
                        <span className="text-xs text-gray-500">{table.fields.length} Alan</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {deleteProjectId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
            <div className="mb-4 text-lg font-semibold">Emin misiniz?</div>
            <div className="mb-2 text-gray-600 text-sm">
              <span>
                <b>{deleteProjectName}</b> adlı projeyi silmek üzeresiniz.<br />
                Lütfen silmek için proje adını yazınız:
              </span>
            </div>
            <input
              type="text"
              className="w-full border rounded px-2 py-1 mb-4"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Proje adını yazınız"
            />
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                onClick={confirmDeleteProject}
                disabled={deleteInput !== deleteProjectName}
              >Evet, Sil</button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDeleteProject}
              >İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;