import React from 'react';
import { PlusCircle } from 'lucide-react';
import { ProjectCreationFormProps } from '../types';
import { PasswordInput } from '../../../components/PasswordInput';

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({
  newProjectName,
  newProjectDescription,
  apiKeyPassword,
  apiKeyPasswordConfirm,
  passwordError,
  creating,
  onNameChange,
  onDescriptionChange,
  onApiKeyPasswordChange,
  onApiKeyPasswordConfirmChange,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key Şifresi *
            </label>
            <PasswordInput
              value={apiKeyPassword}
              onChange={onApiKeyPasswordChange}
              placeholder="API Key şifresini girin..."
              disabled={creating}
              required
              className="px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key Şifresi Tekrar *
            </label>
            <PasswordInput
              value={apiKeyPasswordConfirm}
              onChange={onApiKeyPasswordConfirmChange}
              placeholder="API Key şifresini tekrar girin..."
              disabled={creating}
              required
              className="px-3 py-2"
            />
          </div>
        </div>
        
        {passwordError && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
            {passwordError}
          </div>
        )}

        <button
          type="submit"
          disabled={creating}
          className={`w-full py-3 px-4 rounded-md transition-colors flex items-center justify-center font-medium ${
            creating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <PlusCircle size={20} className="mr-2" />
          {creating ? 'Oluşturuluyor...' : 'Proje Oluştur'}
        </button>
      </form>
    </div>
  );
};

export default ProjectCreationForm;
