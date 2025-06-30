import React from 'react';
import { ProjectInfoFormProps } from '../../types/projectTypes';

const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({ project, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proje Adı
        </label>
        <input
          type="text"
          value={project.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proje Açıklaması
        </label>
        <textarea
          value={project.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Proje hakkında açıklama..."
        />
      </div>
    </div>
  );
};

export default ProjectInfoForm; 