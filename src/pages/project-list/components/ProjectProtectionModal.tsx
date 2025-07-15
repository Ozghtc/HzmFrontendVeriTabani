import React, { useState } from 'react';
import { icons } from '../constants/projectListConstants';

interface ProjectProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  isProtected: boolean;
  projectName: string;
  loading: boolean;
}

const ProjectProtectionModal: React.FC<ProjectProtectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isProtected,
  projectName,
  loading
}) => {
  const [password, setPassword] = useState('');
  const { Lock, Unlock, XCircle } = icons;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password);
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {isProtected ? (
              <Unlock className="text-orange-500" size={24} />
            ) : (
              <Lock className="text-green-500" size={24} />
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {isProtected ? 'Korumayı Kaldır' : 'Proje Koruması'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              <strong>Proje:</strong> {projectName}
            </p>
            
            {isProtected ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-700">
                  Bu proje şu anda korumalı. Korumayı kaldırmak için şifrenizi girin.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700">
                  Projeyi koruma altına almak için bir şifre belirleyin. Bu şifre proje silinirken sorulacak.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {isProtected ? 'Mevcut Şifre' : 'Koruma Şifresi'}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isProtected ? 'Mevcut şifrenizi girin' : 'Güvenli bir şifre belirleyin'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !password.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isProtected
                  ? 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300'
                  : 'bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300'
              }`}
            >
              {loading ? 'İşleniyor...' : isProtected ? 'Korumayı Kaldır' : 'Korumayı Etkinleştir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectProtectionModal; 