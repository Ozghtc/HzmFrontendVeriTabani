export interface Project {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  tableCount: number;
  createdAt: string;
  updatedAt: string;
  isProtected?: boolean;
}

export interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
}

export interface ApiKeyVisibility {
  [key: string]: boolean;
}

export interface DeleteProjectModalProps {
  projectId: number | null;
  projects: Project[];
  deleteConfirmName: string;
  protectionPassword: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  onNameChange: (name: string) => void;
  onPasswordChange: (password: string) => void;
}

export interface ProjectCardProps {
  project: Project;
  showApiKey: boolean;
  onToggleApiKey: () => void;
  onCopyApiKey: () => void;
  onDelete: () => void;
  onNavigateToData: () => void;
  onNavigateToEdit: () => void;
  onToggleProtection: () => void;
  loading: boolean;
}

export interface AddProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  creating: boolean;
} 