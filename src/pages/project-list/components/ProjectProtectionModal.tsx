import React, { useState } from 'react';
import { icons } from '../constants/projectListConstants';

interface ProjectProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string, newPassword?: string) => void;
  isProtected: boolean;
  projectName: string;
  loading: boolean;
}

type ProtectionMode = 'enable' | 'disable' | 'change';

const ProjectProtectionModal: React.FC<ProjectProtectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isProtected,
  projectName,
  loading
}) => {
  const [mode, setMode] = useState<ProtectionMode>(isProtected ? 'disable' : 'enable');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  
  const { Lock, Unlock, XCircle, Eye, EyeOff } = icons;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'enable') {
      if (password.trim() && passwordConfirm.trim() && password === passwordConfirm) {
        onSubmit(password);
      }
    } else if (mode === 'disable') {
      if (password.trim()) {
        onSubmit(password);
      }
    } else if (mode === 'change') {
      if (password.trim() && newPassword.trim() && newPasswordConfirm.trim() && newPassword === newPasswordConfirm) {
        onSubmit(password, newPassword);
      }
    }
  };

  const handleClose = () => {
    setPassword('');
    setPasswordConfirm('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setShowPassword(false);
    setShowPasswordConfirm(false);
    setShowNewPassword(false);
    setShowNewPasswordConfirm(false);
    setMode(isProtected ? 'disable' : 'enable');
    onClose();
  };

  const isFormValid = () => {
    if (mode === 'enable') {
      return password.trim() && passwordConfirm.trim() && password === passwordConfirm;
    } else if (mode === 'disable') {
      return password.trim();
    } else if (mode === 'change') {
      return password.trim() && newPassword.trim() && newPasswordConfirm.trim() && newPassword === newPasswordConfirm;
    }
    return false;
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'enable': return 'Proje Koruması';
      case 'disable': return 'Korumayı Kaldır';
      case 'change': return 'Şifre Değiştir';
      default: return 'Proje Koruması';
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case 'enable': return <Lock className="text-green-500" size={24} />;
      case 'disable': return <Unlock className="text-orange-500" size={24} />;
      case 'change': return <Lock className="text-blue-500" size={24} />;
      default: return <Lock className="text-green-500" size={24} />;
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return 'İşleniyor...';
    switch (mode) {
      case 'enable': return 'Korumayı Etkinleştir';
      case 'disable': return 'Korumayı Kaldır';
      case 'change': return 'Şifreyi Değiştir';
      default: return 'Onayla';
    }
  };

  const getSubmitButtonColor = () => {
    switch (mode) {
      case 'enable': return 'bg-green-500 hover:bg-green-600 disabled:bg-green-300';
      case 'disable': return 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300';
      case 'change': return 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300';
      default: return 'bg-green-500 hover:bg-green-600 disabled:bg-green-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {getModalIcon()}
            <h2 className="text-xl font-bold text-gray-800">
              {getModalTitle()}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Mode Selection */}
        {isProtected && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('disable')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  mode === 'disable' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Korumayı Kaldır
              </button>
              <button
                type="button"
                onClick={() => setMode('change')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  mode === 'change' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Şifre Değiştir
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              <strong>Proje:</strong> {projectName}
            </p>
            
            {/* Info Messages */}
            {mode === 'enable' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700">
                  Projeyi koruma altına almak için bir şifre belirleyin. Bu şifre proje silinirken sorulacak.
                </p>
              </div>
            )}
            
            {mode === 'disable' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-700">
                  Bu proje şu anda korumalı. Korumayı kaldırmak için şifrenizi girin.
                </p>
              </div>
            )}
            
            {mode === 'change' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-700">
                  Proje koruma şifrenizi değiştirmek için eski şifrenizi ve yeni şifrenizi girin.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* ENABLE MODE: Password + Confirm */}
              {mode === 'enable' && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Koruma Şifresi
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Güvenli bir şifre belirleyin"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={loading}
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
                  <div>
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre Tekrar
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswordConfirm ? 'text' : 'password'}
                        id="passwordConfirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Şifrenizi tekrar girin"
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                          passwordConfirm && password !== passwordConfirm 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordConfirm && password !== passwordConfirm && (
                      <p className="text-red-500 text-sm mt-1">Şifreler eşleşmiyor</p>
                    )}
                  </div>
                </>
              )}

              {/* DISABLE MODE: Current Password */}
              {mode === 'disable' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mevcut şifrenizi girin"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      disabled={loading}
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

              {/* CHANGE MODE: Old + New + New Confirm */}
              {mode === 'change' && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Eski Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Eski şifrenizi girin"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
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
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Yeni şifrenizi girin"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre Tekrar
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPasswordConfirm ? 'text' : 'password'}
                        id="newPasswordConfirm"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="Yeni şifrenizi tekrar girin"
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                          newPasswordConfirm && newPassword !== newPasswordConfirm 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {newPasswordConfirm && newPassword !== newPasswordConfirm && (
                      <p className="text-red-500 text-sm mt-1">Şifreler eşleşmiyor</p>
                    )}
                  </div>
                </>
              )}
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
              disabled={loading || !isFormValid()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors text-white ${getSubmitButtonColor()}`}
            >
              {getSubmitButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectProtectionModal; 