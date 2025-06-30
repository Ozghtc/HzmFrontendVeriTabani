import React from 'react';
import { icons } from '../constants/projectConstants';
import { DeleteProjectModalProps } from '../types/projectTypes';

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  project,
  deleteConfirmName,
  onConfirmNameChange,
  onConfirm,
  onCancel
}) => {
  const { AlertTriangle, Trash2 } = icons;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Projeyi Sil</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            <strong>{project?.name || 'Bu proje'}</strong> projesini ve tüm tablolarını kalıcı olarak silmek istediğinizden emin misiniz?
          </p>
          
          <p className="text-sm text-red-600 mb-4">
            ⚠️ Bu işlem geri alınamaz! Projenin tüm tabloları ve verileri silinecektir.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Onaylamak için proje adını tam olarak yazın: <strong>{project?.name}</strong>
            </label>
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => onConfirmNameChange(e.target.value)}
              placeholder={project?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleteConfirmName !== (project?.name || '')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Projeyi Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal; 