export interface Project {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  tableCount: number;
  createdAt: string;
  updatedAt: string;
  isProtected?: boolean;
  isTestEnvironment?: boolean;
  parentProjectId?: number;
  testEnvironmentId?: number;
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
  onCreateTestProject?: () => void; // Yeni prop
  onTransferToLive?: () => void; // Test projesinden canlıya aktar prop
  loading: boolean;
  liveProject?: any; // Parent proje bilgisi (test projesi için)
}

export interface AddProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>;
  creating: boolean;
} 