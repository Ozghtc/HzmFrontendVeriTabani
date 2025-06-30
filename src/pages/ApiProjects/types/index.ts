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
