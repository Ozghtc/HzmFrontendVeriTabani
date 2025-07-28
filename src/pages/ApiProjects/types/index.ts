export interface ApiProject {
  id: number;
  name: string;
  description?: string;
  apiKey: string;
  createdAt: string;
  tableCount: number;
}

export interface ApiProjectsState {
  newProjectName: string;
  newProjectDescription: string;
  deletingProject: number | null;
  deleteConfirmName: string;
  showApiKey: { [key: string]: boolean };
  creating: boolean;
}

export interface ProjectCreationFormProps {
  newProjectName: string;
  newProjectDescription: string;
  apiKeyPassword: string;
  apiKeyPasswordConfirm: string;
  passwordError: string;
  creating: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onApiKeyPasswordChange: (value: string) => void;
  onApiKeyPasswordConfirmChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}
