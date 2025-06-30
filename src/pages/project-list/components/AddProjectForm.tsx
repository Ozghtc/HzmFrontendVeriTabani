import React, { useState } from 'react';
import { icons } from '../constants/projectListConstants';
import { AddProjectFormProps } from '../types/projectListTypes';

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onSubmit, creating }) => {
  const { PlusCircle } = icons;
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim() && !creating) {
      await onSubmit({
        name: newProjectName,
        description: newProjectDescription
      });
      
      // Clear form on success
      setNewProjectName('');
      setNewProjectDescription('');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <PlusCircle size={20} className="mr-2 text-blue-600" />
        Yeni Proje Oluştur
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proje Adı *
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Proje adını girin..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={creating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <input
              type="text"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Proje açıklaması (isteğe bağlı)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={creating}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={creating}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center font-medium ${
              creating 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <PlusCircle size={20} className="mr-2" />
            {creating ? 'Oluşturuluyor...' : 'Proje Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm; 