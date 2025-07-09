import React from 'react';
import { useUsersManagement } from './database-users/hooks/useUsersManagement';
import { filterUsers } from './database-users/utils/userHelpers';
import { icons } from './database-users/constants/userConstants';
import { DEFAULT_USER_DATA } from './database-users/constants/userConstants';
import { FaDatabase } from 'react-icons/fa'; // fallback ikon

// Components
import UsersLoading from './database-users/components/UsersLoading';
import UsersNotification from './database-users/components/UsersNotification';
import UsersHeader from './database-users/components/UsersHeader';
import UsersStats from './database-users/components/UsersStats';
import UsersFilters from './database-users/components/UsersFilters';
import UsersTable from './database-users/components/UsersTable';
import AddUserModal from './database-users/components/AddUserModal';
import DeleteUserModal from './database-users/components/DeleteUserModal';

const DatabaseUsers = () => {
  const {
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
    setDeleteConfirmName,
    setSearchTerm,
    setFilterStatus,
    setShowAddUserForm,
    setEditUserData,
    setNewUserData,
    handleAddUser,
    handleEditUser,
    handleSaveUser,
    handleCancelEdit,
    handleDeleteUser,
    confirmDeleteUser,
    cancelDeleteUser
  } = useUsersManagement();

  // users undefined/null kontrolü
  const safeUsers = users || [];
  console.log('users:', safeUsers);
  const { Database } = icons;

  // Loading state
  if (usersLoading) {
    return <UsersLoading />;
  }

  // filterUsers fonksiyonunu da güvenli hale getir
  const filteredUsers = filterUsers(safeUsers as any, searchTerm, filterStatus);
  console.log('filteredUsers:', filteredUsers);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Notification */}
      {notification && <UsersNotification notification={notification} />}

      {/* Header */}
      <UsersHeader onNavigateBack={() => navigate('/admin')} />

      <main className="container mx-auto p-4">
        {/* Stats Cards */}
        <UsersStats users={users} />

        {/* Filters and Add User Button */}
        <UsersFilters
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterStatus}
          onAddUser={() => setShowAddUserForm(true)}
        />

        {/* Users Table */}
        <UsersTable
          filteredUsers={filteredUsers}
          editingUser={editingUser}
          editUserData={editUserData}
          onEditUser={handleEditUser}
          onSaveUser={handleSaveUser}
          onCancelEdit={handleCancelEdit}
          onDeleteUser={handleDeleteUser}
          onEditDataChange={setEditUserData}
        />

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md mt-6">
            <FaDatabase className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun kullanıcı bulunmamaktadır.</p>
          </div>
        )}
      </main>

      {/* Add User Modal */}
      {showAddUserForm && (
        <AddUserModal
          newUserData={newUserData}
          onDataChange={setNewUserData}
          onSubmit={handleAddUser}
          onClose={() => {
            setShowAddUserForm(false);
            setNewUserData(DEFAULT_USER_DATA);
          }}
        />
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          deleteConfirmName={deleteConfirmName}
          onConfirmNameChange={setDeleteConfirmName}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};

export default DatabaseUsers;