import React, { useState } from 'react';
import { icons } from '../../constants/projectListConstants';
import { ProjectCardProps } from '../../types/projectListTypes';
import { TestTube, ArrowRight, Link } from 'lucide-react';
import ProjectCard from './index';

interface ProjectGroupProps {
  mainProject: any;
  testProject?: any;
  showApiKey: Record<number, boolean>;
  onToggleApiKey: (projectId: number) => void;
  onCopyApiKey: (apiKey: string) => void;
  onDelete: (projectId: number) => void;
  onNavigateToData: (projectId: number) => void;
  onNavigateToEdit: (projectId: number) => void;
  onToggleProtection: (projectId: number) => void;
  onCreateTestProject: (projectId: number) => void;
  loading: boolean;
}

const ProjectGroup: React.FC<ProjectGroupProps> = ({
  mainProject,
  testProject,
  showApiKey,
  onToggleApiKey,
  onCopyApiKey,
  onDelete,
  onNavigateToData,
  onNavigateToEdit,
  onToggleProtection,
  onCreateTestProject,
  loading
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasTestEnvironment = !!testProject;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg border-2 border-blue-200 p-4">
      {/* Group Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <TestTube className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-800">
              {mainProject.name} {hasTestEnvironment ? '& Test Ortamı' : ''}
            </h3>
            <p className="text-sm text-blue-600">
              {hasTestEnvironment ? 'Ana Proje + Test Ortamı' : 'Ana Proje'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <ArrowRight 
            size={16} 
            className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>
      </div>
      
      {/* API Key Connection Info */}
      {hasTestEnvironment && (
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-4 border border-blue-200">
          <div className="flex items-center text-sm text-blue-700">
            <Link size={14} className="mr-2" />
            <span className="font-medium">API Key Bağlantısı:</span>
            <span className="ml-2 text-blue-600">
              Ana proje API key'i test ortamına yönlendiriliyor
            </span>
          </div>
        </div>
      )}
      
      {/* Projects Grid */}
      {isExpanded && (
        <div className={`grid gap-4 ${hasTestEnvironment ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {/* Main Project */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
              Ana Proje
            </div>
            <ProjectCard
              project={mainProject}
              showApiKey={showApiKey[mainProject.id] || false}
              onToggleApiKey={() => onToggleApiKey(mainProject.id)}
              onCopyApiKey={() => onCopyApiKey(mainProject.apiKey)}
              onDelete={() => onDelete(mainProject.id)}
              onNavigateToData={() => onNavigateToData(mainProject.id)}
              onNavigateToEdit={() => onNavigateToEdit(mainProject.id)}
              onToggleProtection={() => onToggleProtection(mainProject.id)}
              onCreateTestProject={() => onCreateTestProject(mainProject.id)}
              loading={loading}
            />
          </div>
          
          {/* Test Project */}
          {hasTestEnvironment && testProject && (
            <div className="relative">
              <div className="absolute -top-2 -left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                Test Ortamı
              </div>
              <ProjectCard
                project={testProject}
                showApiKey={showApiKey[testProject.id] || false}
                onToggleApiKey={() => onToggleApiKey(testProject.id)}
                onCopyApiKey={() => onCopyApiKey(testProject.apiKey)}
                onDelete={() => onDelete(testProject.id)}
                onNavigateToData={() => onNavigateToData(testProject.id)}
                onNavigateToEdit={() => onNavigateToEdit(testProject.id)}
                onToggleProtection={() => onToggleProtection(testProject.id)}
                onCreateTestProject={() => {}} // Test projesi için test projesi oluşturma yok
                loading={loading}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Group Stats */}
      {isExpanded && hasTestEnvironment && (
        <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-800">{mainProject.tableCount || 0}</div>
              <div className="text-blue-600">Ana Proje Tabloları</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-800">{testProject?.tableCount || 0}</div>
              <div className="text-purple-600">Test Ortamı Tabloları</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGroup; 