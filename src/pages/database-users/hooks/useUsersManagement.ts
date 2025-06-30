import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../context/DatabaseContext';
import { useApiUsers } from '../../../hooks/useApiAdmin';
import { User } from '../../../types';
import { 
  NotificationState, 
  EditUserData, 
  NewUserData, 
  FilterStatus 
} from '../types/userTypes';
import { NOTIFICATION_TIMEOUT, DEFAULT_USER_DATA } from '../constants/userConstants';

export const useUsersManagement = () => {
  const { state, dispatch, register } = useDatabase();
  const { users: backendUsers, loading: usersLoading, fetchUsers, updateUser, deleteUser } = useApiUsers();
  const navigate = useNavigate();
  
  // Use backend users instead of localStorage
  const users = backendUsers || [];
  
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [editUserData, setEditUserData] = useState<EditUserData>(DEFAULT_USER_DATA);
  const [newUserData, setNewUserData] = useState<NewUserData>(DEFAULT_USER_DATA);

  // Show notification with auto-hide
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), NOTIFICATION_TIMEOUT);
  };

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
        setNewUserData(DEFAULT_USER_DATA);
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
    setEditUserData(DEFAULT_USER_DATA);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setDeleteConfirmName('');
  };

  const confirmDeleteUser = async () => {
    if (deletingUser && deleteConfirmName === deletingUser.name) {
      try {
        console.log('🗑️ Attempting to delete user:', deletingUser.id, deletingUser.name);
        const success = await deleteUser(deletingUser.id);
        
        // Always close modal first
        setDeletingUser(null);
        setDeleteConfirmName('');
        
        if (success) {
          // Refresh users from backend
          await fetchUsers();
          showNotification('success', 'Kullanıcı başarıyla silindi!');
          console.log('✅ User deleted successfully');

          // If user deleted themselves, logout
          if (state.user?.id === deletingUser.id) {
            dispatch({ type: 'LOGOUT' });
            navigate('/');
          }
        } else {
          console.log('❌ User delete failed');
          showNotification('error', 'Kullanıcı silinirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('💥 Error deleting user:', error);
        // Always close modal even on error
        setDeletingUser(null);
        setDeleteConfirmName('');
        showNotification('error', 'Kullanıcı silinirken bir hata oluştu.');
      }
    } else {
      // Name doesn't match, show error but don't close modal
      showNotification('error', 'Kullanıcı adını doğru yazmanız gerekiyor.');
    }
  };

  const cancelDeleteUser = () => {
    setDeletingUser(null);
    setDeleteConfirmName('');
  };

  return {
    // Data
    users,
    usersLoading,
    
    // State
    editingUser,
    deletingUser,
    deleteConfirmName,
    searchTerm,
    filterStatus,
    showAddUserForm,
    notification,
    editUserData,
    newUserData,
    
    // Actions
    navigate,
    setEditingUser,
    setDeleteConfirmName,
    setSearchTerm,
    setFilterStatus,
    setShowAddUserForm,
    setEditUserData,
    setNewUserData,
    showNotification,
    handleAddUser,
    handleEditUser,
    handleSaveUser,
    handleCancelEdit,
    handleDeleteUser,
    confirmDeleteUser,
    cancelDeleteUser
  };
}; 