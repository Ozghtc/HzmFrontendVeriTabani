import React from 'react';
import { ProjectInfoDisplayProps } from '../../types/projectTypes';

const ProjectInfoDisplay: React.FC<ProjectInfoDisplayProps> = ({ project }) => {
  const tableCount = project.tables?.length || project.tableCount || 0;
  const fieldCount = project.tables?.reduce(
    (total: number, table: any) => total + (table.fields?.length || 0), 
    0
  ) || 0;

  return (
    <div className="border-t pt-6">
      <h4 className="text-md font-semibold text-gray-800 mb-2">Proje Bilgileri</h4>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Proje ID:</span>
          <span className="font-mono text-gray-800">{project.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Oluşturulma:</span>
          <span className="text-gray-800">
            {new Date(project.createdAt).toLocaleString('tr-TR')}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tablo Sayısı:</span>
          <span className="text-gray-800">{tableCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Toplam Alan:</span>
          <span className="text-gray-800">{fieldCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoDisplay; 