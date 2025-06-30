import { User } from '../../../types';

export interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface EditUserData {
  name: string;
  email: string;
  password: string;
  subscriptionType: User['subscriptionType'];
  isActive: boolean;
}

export interface NewUserData {
  name: string;
  email: string;
  password: string;
  subscriptionType: User['subscriptionType'];
  isActive: boolean;
}

export type FilterStatus = 'all' | 'active' | 'inactive';

export interface UserTableRowProps {
  user: User;
  isEditing: boolean;
  editUserData: EditUserData;
  onEdit: (user: User) => void;
  onSave: (userId: string) => void;
  onCancelEdit: () => void;
  onDelete: (user: User) => void;
  onEditDataChange: (data: EditUserData) => void;
}

export interface UsersFiltersProps {
  searchTerm: string;
  filterStatus: FilterStatus;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterStatus) => void;
  onAddUser: () => void;
}

export interface DeleteUserModalProps {
  user: User;
  deleteConfirmName: string;
  onConfirmNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
} 