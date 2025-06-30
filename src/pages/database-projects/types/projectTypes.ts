export interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ProjectsFilters {
  searchTerm: string;
  filterUser: string;
}

export interface ProjectCardProps {
  project: any;
  showApiKey: boolean;
  onToggleApiKey: () => void;
  onDelete: () => void;
  onNavigateToData: () => void;
  onNavigateToEdit: () => void;
}

export interface DeleteProjectModalProps {
  project: any;
  deleteConfirmName: string;
  onConfirmNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
} 