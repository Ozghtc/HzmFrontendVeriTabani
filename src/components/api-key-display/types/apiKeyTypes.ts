import { Project, ApiKey } from '../../../types';

export type Permission = 'read' | 'write' | 'delete' | 'admin';

export interface ApiKeyDisplayProps {
  project: Project;
  className?: string;
}

export interface NewKeyData {
  name: string;
  permissions: Permission[];
  expiresAt: string;
}

export interface ApiExample {
  description: string;
  method: string;
  url: string;
  body?: any;
}

export interface ApiExamples {
  [key: string]: ApiExample;
}

export interface PermissionBadgeProps {
  permission: Permission;
}

export interface ApiKeyMaskProps {
  apiKey: string;
  show: boolean;
  onToggle: () => void;
  onCopy: () => void;
}

export interface MainApiKeyProps {
  project: Project;
  showMainKey: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onRegenerate: () => void;
}

export interface AdditionalApiKeysProps {
  project: Project;
  onCopyKey: (key: string) => void;
  onDeleteKey: (keyId: string) => void;
}

export interface AddApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keyData: NewKeyData) => void;
} 