import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ApiProject } from '../types';

interface DeleteConfirmationModalProps {
  project: ApiProject | null;
  deleteConfirmName: string;
  onConfirmNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  project,
  deleteConfirmName,
  onConfirmNameChange,
  onConfirm,
  onCancel
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-bold text-gray-800">Projeyi Sil</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        
        <p className="text-sm text-gray-500 mb-4">
          Onaylamak için proje adını yazın: <strong>{project.name}</strong>
        </p>
        
        <input
          type="text"
          value={deleteConfirmName}
          onChange={(e) => onConfirmNameChange(e.target.value)}
          placeholder="Proje adını yazın"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleteConfirmName !== project.name}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
