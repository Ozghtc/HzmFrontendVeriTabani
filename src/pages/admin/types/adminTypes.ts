export interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  iconColor: string;
}

export interface ManagementCardProps {
  title: string;
  icon: React.ReactElement;
  iconColor: string;
  borderColor: string;
  description: string;
  stats: string;
  mainValue: number | string;
  onClick: () => void;
}

export interface QuickActionButtonProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  colorClass: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalPlans: number;
  totalProjects: number;
  totalTables: number;
  dataSize: string;
  activePlans: number;
} 