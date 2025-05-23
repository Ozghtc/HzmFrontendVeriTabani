import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { ArrowLeft } from 'lucide-react';
import TablePanel from '../components/panels/TablePanel';
import FieldPanel from '../components/panels/FieldPanel';

const ProjectManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useDatabase();

  // Find the project and select it
  React.useEffect(() => {
    if (projectId) {
      dispatch({ type: 'SELECT_PROJECT', payload: { projectId } });
    }
  }, [projectId, dispatch]);

  const project = state.projects.find(p => p.id === projectId);

  if (!project) {
    return <div>Proje bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/projects')}
            className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TablePanel />
          <FieldPanel />
        </div>
      </main>
    </div>
  );
};

export default ProjectManagement;