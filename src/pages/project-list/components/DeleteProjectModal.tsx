import React, { useState } from 'react';
import { icons } from '../constants/projectListConstants';
import { DeleteProjectModalProps } from '../types/projectListTypes';
import { ApiKeyGenerator } from '../../../utils/apiKeyGenerator';

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  projectId,
  projects,
  deleteConfirmName,
  protectionPassword,
  onConfirm,
  onCancel,
  onNameChange,
  onPasswordChange
}) => {
  const { AlertTriangle, Trash2, Eye, EyeOff } = icons;
  const [showPassword, setShowPassword] = useState(false);
  
  if (!projectId) return null;
  
  const projectToDelete = projects.find(p => p.id === projectId);
  if (!projectToDelete) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-red-500 mr-3" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Projeyi Sil</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            <strong>{projectToDelete.name}</strong> projesini kalıcı olarak silmek istediğinizden emin misiniz?
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Silinecek proje bilgileri:</p>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Proje Adı:</strong> {projectToDelete.name}</div>
              <div><strong>Tablo Sayısı:</strong> {projectToDelete.tableCount || 0}</div>
              <div><strong>API Key:</strong> {ApiKeyGenerator.maskApiKey(projectToDelete.apiKey)}</div>
              <div><strong>Oluşturulma:</strong> {new Date(projectToDelete.createdAt).toLocaleDateString('tr-TR')}</div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 p-3 rounded-md mb-4">
            <p className="text-sm text-red-800 font-medium mb-1">⚠️ Dikkat!</p>
            <p className="text-sm text-red-700">
              Bu işlem geri alınamaz! Projenin tüm verileri ve API erişimi kalıcı olarak silinecektir.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onaylamak için proje adını tam olarak yazın: <strong>{projectToDelete.name}</strong>
              </label>
              <input
                type="text"
                value={deleteConfirmName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder={projectToDelete.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            {/* Protection Password Field */}
            {(projectToDelete as any).isProtected && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔒 Bu proje korumalı. Silmek için koruma şifresini girin:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={protectionPassword}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Koruma şifrenizi girin"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={
              deleteConfirmName !== projectToDelete.name ||
              ((projectToDelete as any).isProtected && !protectionPassword.trim())
            }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
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