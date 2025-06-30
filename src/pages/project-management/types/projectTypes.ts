export type ProjectTabType = 'tables' | 'api' | 'settings';

export interface ProjectSettings {
  allowApiAccess?: boolean;
  requireAuth?: boolean;
  maxRequestsPerMinute?: number;
  enableWebhooks?: boolean;
  webhookUrl?: string;
}

export interface ProjectHeaderProps {
  project: any;
  projectOwner: any;
  currentUser: any;
  onBack: () => void;
}

export interface ProjectTabsProps {
  activeTab: ProjectTabType;
  setActiveTab: (tab: ProjectTabType) => void;
  isAdmin: boolean;
}

export interface ProjectInfoFormProps {
  project: any;
  onUpdate: (updates: Partial<any>) => void;
}

export interface ApiSettingsFormProps {
  settings: ProjectSettings;
  onUpdate: (settings: ProjectSettings) => void;
}

export interface ProjectInfoDisplayProps {
  project: any;
}

export interface TabContentProps {
  project: any;
}

export interface ProjectNotFoundProps {
  onBack: () => void;
}

export interface SettingsTabProps {
  project: any;
  onProjectUpdate: (updates: Partial<any>) => void;
  onSettingsUpdate: (settings: ProjectSettings) => void;
} 