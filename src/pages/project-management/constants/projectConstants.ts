import { ProjectTabType } from '../types/projectTypes';

export const PROJECT_TABS: Record<ProjectTabType, { label: string; icon: string }> = {
  tables: {
    label: 'Tablolar & Alanlar',
    icon: 'Database'
  },
  api: {
    label: 'API Yönetimi',
    icon: 'Key'
  },
  settings: {
    label: 'Proje Ayarları',
    icon: 'Settings'
  }
};

export const DEFAULT_PROJECT_SETTINGS = {
  allowApiAccess: true,
  requireAuth: false,
  maxRequestsPerMinute: 100,
  enableWebhooks: false,
  webhookUrl: ''
};

export const API_RATE_LIMITS = {
  MIN: 1,
  MAX: 10000,
  DEFAULT: 100
};

export const LOADING_MESSAGES = {
  PROJECT: 'Proje yükleniyor...',
  SETTINGS: 'Ayarlar kaydediliyor...'
}; 