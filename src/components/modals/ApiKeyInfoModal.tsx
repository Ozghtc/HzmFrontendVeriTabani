import React, { useState } from 'react';
import { X, Copy, Eye, EyeOff, Edit3, Save, Key } from 'lucide-react';
import { PasswordInput } from '../PasswordInput';

interface ApiKeyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    name: string;
    apiKey: string;
    apiKeyPassword?: string;
  };
  onUpdatePassword?: (projectId: number, newPassword: string) => Promise<void>;
}

export const ApiKeyInfoModal: React.FC<ApiKeyInfoModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdatePassword
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const validatePassword = () => {
    if (!newPassword || newPassword.length < 8) {
      setPasswordError('Şifre en az 8 karakter olmalıdır');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSavePassword = async () => {
    if (!validatePassword() || !onUpdatePassword) return;

    setSaving(true);
    try {
      await onUpdatePassword(project.id, newPassword);
      setIsEditing(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } catch (error) {
      setPasswordError('Şifre güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Key className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-bold text-gray-800">API Key Bilgileri</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600">Proje ID: {project.id}</p>
          </div>

          {/* API Key Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">API Key</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title={showApiKey ? 'Gizle' : 'Göster'}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => handleCopy(project.apiKey, 'API Key')}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Kopyala"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-md p-3 font-mono text-sm break-all">
              {showApiKey ? project.apiKey : `${project.apiKey.slice(0, 8)}${'•'.repeat(project.apiKey.length - 12)}${project.apiKey.slice(-4)}`}
            </div>
          </div>

          {/* API Key Password Section */}
          {project.apiKeyPassword && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">API Key Şifresi</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title={showPassword ? 'Gizle' : 'Göster'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleCopy(project.apiKeyPassword!, 'API Key Şifresi')}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Kopyala"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                    title="Güncelle"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 rounded-md p-3 font-mono text-sm">
                {showPassword ? project.apiKeyPassword : '•'.repeat(project.apiKeyPassword.length)}
              </div>
            </div>
          )}

          {/* Edit Password Section */}
          {isEditing && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Şifre Güncelle</h4>
              <div className="space-y-3">
                <PasswordInput
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Yeni şifre girin..."
                  required
                />
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Yeni şifre tekrar..."
                  required
                />
                {passwordError && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
                    {passwordError}
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={saving}
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSavePassword}
                    disabled={saving}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                      saving
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Save size={16} className="mr-1" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 