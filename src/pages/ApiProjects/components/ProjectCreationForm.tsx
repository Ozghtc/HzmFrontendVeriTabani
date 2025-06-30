import React from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface ProjectCreationFormProps {
  newProjectName: string;
  newProjectDescription: string;
  creating: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({
  newProjectName,
  newProjectDescription,
  creating,
  onNameChange,
  onDescriptionChange,
  onSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <PlusCircle size={24} className="text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Yeni Proje Oluştur</h2>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proje Adı *
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Proje adını girin..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={creating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={newProjectDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Proje açıklaması (isteğe bağlı)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!newProjectName.trim() || creating}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {creating ? (
            <>
              <RefreshCw size={16} className="animate-spin mr-2" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <PlusCircle size={16} className="mr-2" />
              Proje Oluştur
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProjectCreationForm;
