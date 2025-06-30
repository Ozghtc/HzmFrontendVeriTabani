import React from 'react';
import { icons } from '../constants/projectConstants';
import { calculateTotalTables, calculateActiveUsers } from '../utils/projectHelpers';

interface ProjectsStatsProps {
  projects: any[];
}

const ProjectsStats: React.FC<ProjectsStatsProps> = ({ projects }) => {
  const { Database, Table, FileText, User } = icons;
  
  const stats = [
    {
      title: 'Toplam Proje',
      value: projects.length,
      icon: Database,
      color: 'green'
    },
    {
      title: 'Toplam Tablo',
      value: calculateTotalTables(projects),
      icon: Table,
      color: 'blue'
    },
    {
      title: 'Toplam Alan',
      value: 0,
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Aktif Kullanıcı',
      value: calculateActiveUsers(projects),
      icon: User,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string, bg: string }> = {
      green: { text: 'text-green-600', bg: '' },
      blue: { text: 'text-blue-600', bg: '' },
      purple: { text: 'text-purple-600', bg: '' },
      orange: { text: 'text-orange-600', bg: '' }
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        const Icon = stat.icon;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${colorClasses.text}`}>{stat.value}</p>
              </div>
              <Icon className={colorClasses.text} size={40} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsStats; 