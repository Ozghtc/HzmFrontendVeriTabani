import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useApiUsers } from '../hooks/useApiAdmin';
import { 
  Users, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Save,
  X,
  Mail,
  Lock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  UserPlus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { User } from '../types';

const DatabaseUsers = () => {
  const { state, dispatch, register } = useDatabase();
  const { users: backendUsers, loading: usersLoading, fetchUsers, updateUser, deleteUser } = useApiUsers();
  const navigate = useNavigate();
  
  // Use backend users instead of localStorage
  const users = backendUsers || [];
  
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [editUserData, setEditUserData] = useState<{
    name: string;
    email: string;
    password: string;
    subscriptionType: User['subscriptionType'];
    isActive: boolean;
  }>({
    name: '',
    email: '',
    password: '',
    subscriptionType: 'free',
    isActive: true
  });
  const [newUserData, setNewUserData] = useState<{
    name: string;
    email: string;
    password: string;
    subscriptionType: User['subscriptionType'];
    isActive: boolean;
  }>({
    name: '',
    email: '',
    password: '',
    subscriptionType: 'free',
    isActive: true
  });

  // Show notification with auto-hide
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Loading state
  if (usersLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Filter users based on search and status with null safety
  const filteredUsers = users.filter(user => {
    if (!user) return false;
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.password.trim()) {
      showNotification('error', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const success = await register(newUserData.email, newUserData.password, newUserData.name);
      if (success) {
        // Refresh users from backend
        await fetchUsers();
        
        setShowAddUserForm(false);
        setNewUserData({
          name: '',
          email: '',
          password: '',
          subscriptionType: 'free',
          isActive: true
        });
        showNotification('success', 'Kullanıcı başarıyla eklendi!');
      } else {
        showNotification('error', 'Bu e-posta adresi zaten kullanılıyor.');
      }
    } catch (error) {
      showNotification('error', 'Kullanıcı eklenirken bir hata oluştu.');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditUserData({
      name: user.name,
      email: user.email,
      password: '••••••••',
      subscriptionType: user.subscriptionType,
      isActive: user.isActive
    });
  };

  const handleSaveUser = async (userId: string) => {
    try {
      // Prepare user data for backend update
      const plan = state.pricingPlans.find(p => p.name.toLowerCase() === editUserData.subscriptionType);
      
      const userData = {
        name: editUserData.name,
        email: editUserData.email,
        isActive: editUserData.isActive,
        subscriptionType: editUserData.subscriptionType,
        maxProjects: plan ? plan.maxProjects : 2,
        maxTables: plan ? plan.maxTables : 5
      };

      console.log('🔄 Attempting to update user:', userId, userData);

      // Update user via backend API
      const success = await updateUser(userId, userData);
      
      if (success) {
        setEditingUser(null);
        showNotification('success', 'Kullanıcı başarıyla güncellendi!');
        console.log('✅ User update UI completed successfully');
      } else {
        showNotification('error', 'Kullanıcı güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('❌ User update error:', error);
      showNotification('error', 'Kullanıcı güncellenirken bir hata oluştu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditUserData({
      name: '',
      email: '',
      password: '',
      subscriptionType: 'free',
      isActive: true
    });
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setDeleteConfirmName('');
  };

  const confirmDeleteUser = async () => {
    if (deletingUser && deleteConfirmName === deletingUser.name) {
      try {
        const success = await deleteUser(deletingUser.id);
        
        if (success) {
          // Refresh users from backend
          await fetchUsers();
          
          setDeletingUser(null);
          setDeleteConfirmName('');
          showNotification('success', 'Kullanıcı başarıyla silindi!');

          if (state.user?.id === deletingUser.id) {
            dispatch({ type: 'LOGOUT' });
            navigate('/');
          }
        } else {
          showNotification('error', 'Kullanıcı silinirken bir hata oluştu.');
        }
      } catch (error) {
        showNotification('error', 'Kullanıcı silinirken bir hata oluştu.');
      }
    }
  };

  const cancelDeleteUser = () => {
    setDeletingUser(null);
    setDeleteConfirmName('');
  };

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserRoleText = (user: User) => {
    if (user.isAdmin) return 'Admin';
    if (user.subscriptionType !== 'free') return 'Yönetici';
    return 'Kullanıcı';
  };

  const getUserRoleColor = (user: User) => {
    if (user.isAdmin) return 'text-red-600 bg-red-100';
    if (user.subscriptionType !== 'free') return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} className="mr-2" />
          ) : notification.type === 'error' ? (
            <XCircle size={20} className="mr-2" />
          ) : (
            <AlertTriangle size={20} className="mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center">
            <Users size={28} className="mr-3" />
            <h1 className="text-2xl font-bold">Database - Kullanıcı Yönetimi</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <Users className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Kullanıcı</p>
                <p className="text-3xl font-bold text-purple-600">
                  {users.filter(u => u.subscriptionType !== 'free').length}
                </p>
              </div>
              <Users className="text-purple-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Kullanıcı</p>
                <p className="text-3xl font-bold text-red-600">
                  {users.filter(u => u.isAdmin).length}
                </p>
              </div>
              <Users className="text-red-600" size={40} />
            </div>
          </div>
        </div>

        {/* Filters and Add User Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Kullanıcılar</option>
                  <option value="active">Aktif Kullanıcılar</option>
                  <option value="inactive">Pasif Kullanıcılar</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowAddUserForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus size={18} className="mr-2" />
              Kullanıcı Ekle
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İletişim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Abonelik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Limitler
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              {editingUser === user.id ? (
                                <input
                                  type="text"
                                  value={editUserData.name}
                                  onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                                  className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                                />
                              ) : (
                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                  {user.name}
                                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getUserRoleColor(user)}`}>
                                    {getUserRoleText(user)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail size={14} className="mr-2 text-gray-400" />
                              <input
                                type="email"
                                value={editUserData.email}
                                onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                                className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-full"
                              />
                            </div>
                            <div className="flex items-center">
                              <Lock size={14} className="mr-2 text-gray-400" />
                              <input
                                type="password"
                                value={editUserData.password}
                                onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                                placeholder="Yeni şifre"
                                className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-full"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail size={14} className="mr-2 text-gray-400" />
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center">
                              <Lock size={14} className="mr-2 text-gray-400" />
                              ••••••••
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <select
                            value={editUserData.subscriptionType}
                            onChange={(e) => setEditUserData({...editUserData, subscriptionType: e.target.value as User['subscriptionType']})}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="free">Ücretsiz</option>
                            <option value="basic">Temel</option>
                            <option value="premium">Premium</option>
                            <option value="enterprise">Kurumsal</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(user.subscriptionType)}`}>
                            {user.subscriptionType === 'free' ? 'Ücretsiz' : 
                             user.subscriptionType === 'basic' ? 'Temel' :
                             user.subscriptionType === 'premium' ? 'Premium' : 'Kurumsal'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>Proje: {user.maxProjects === -1 ? '∞' : user.maxProjects}</div>
                          <div>Tablo: {user.maxTables === -1 ? '∞' : user.maxTables}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <select
                            value={editUserData.isActive ? 'active' : 'inactive'}
                            onChange={(e) => setEditUserData({...editUserData, isActive: e.target.value === 'active'})}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingUser === user.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveUser(user.id)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              <Save size={14} className="mr-1" />
                              Kaydet
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                              <X size={14} className="mr-1" />
                              İptal
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              <Edit size={14} className="mr-1" />
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Sil
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Yeni Kullanıcı Ekle</h3>
              <button
                onClick={() => {
                  setShowAddUserForm(false);
                  setNewUserData({
                    name: '',
                    email: '',
                    password: '',
                    subscriptionType: 'free',
                    isActive: true
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Kullanıcının adı ve soyadı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="kullanici@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="En az 6 karakter"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abonelik Türü
                </label>
                <select
                  value={newUserData.subscriptionType}
                  onChange={(e) => setNewUserData({...newUserData, subscriptionType: e.target.value as User['subscriptionType']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="free">Ücretsiz</option>
                  <option value="basic">Temel</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Kurumsal</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newUserActive"
                  checked={newUserData.isActive}
                  onChange={(e) => setNewUserData({...newUserData, isActive: e.target.checked})}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="newUserActive" className="ml-2 block text-sm text-gray-700">
                  Kullanıcıyı aktif olarak oluştur
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserForm(false);
                    setNewUserData({
                      name: '',
                      email: '',
                      password: '',
                      subscriptionType: 'free',
                      isActive: true
                    });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <UserPlus size={16} className="mr-2" />
                  Kullanıcı Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Kullanıcıyı Sil</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                <strong>{deletingUser.name}</strong> kullanıcısını ve tüm projelerini kalıcı olarak silmek istediğinizden emin misiniz?
              </p>
              
              <p className="text-sm text-red-600 mb-4">
                ⚠️ Bu işlem geri alınamaz! Kullanıcının tüm projeleri ve verileri silinecektir.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Onaylamak için kullanıcının adını tam olarak yazın: <strong>{deletingUser.name}</strong>
                </label>
                <input
                  type="text"
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                  placeholder={deletingUser.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteUser}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleteConfirmName !== deletingUser.name}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Kullanıcıyı Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseUsers;