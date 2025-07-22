import React, { useState } from 'react';
import { icons } from '../../constants/projectListConstants';
import { TestTube, ArrowRight, Link, Play, Beaker } from 'lucide-react';
import ProjectCard from './index';

interface ProjectGroupProps {
  project: any;
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
  project,
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
  
  // Test projesi klonu oluştur
  const testProject = {
    ...project,
    id: project.id + 1000, // Fake ID for test project
    name: `${project.name} - Test`,
    description: `Test ortamı: ${project.description || project.name}`,
    apiKey: `test_${project.apiKey}`,
    isTestEnvironment: true
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-xl shadow-xl border-2 border-blue-300 p-6 mb-6">
      {/* Group Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4 shadow-lg">
            <TestTube className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              📊 {project.name}
            </h2>
            <p className="text-sm text-blue-600 font-medium">
              Canlı Proje + Test Ortamı Görünümü
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 shadow-sm"
        >
          <ArrowRight 
            size={20} 
            className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>
      </div>
      
      {/* Connection Info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-blue-200 shadow-sm">
        <div className="flex items-center text-sm text-blue-700">
          <Link size={16} className="mr-3" />
          <span className="font-semibold">Bağlantı Durumu:</span>
          <span className="ml-2 text-blue-600">
            Test ortamı canlı projeye bağlı - Aynı tablolar, ayrı veriler
          </span>
        </div>
      </div>
      
      {/* Projects Grid */}
      {isExpanded && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Live Project - Sol */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-2 rounded-full font-bold z-10 shadow-lg">
              <Play size={14} className="inline mr-1" />
              CANLI
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <ProjectCard
                project={project}
                showApiKey={showApiKey[project.id] || false}
                onToggleApiKey={() => onToggleApiKey(project.id)}
                onCopyApiKey={() => onCopyApiKey(project.apiKey)}
                onDelete={() => onDelete(project.id)}
                onNavigateToData={() => onNavigateToData(project.id)}
                onNavigateToEdit={() => onNavigateToEdit(project.id)}
                onToggleProtection={() => onToggleProtection(project.id)}
                onCreateTestProject={() => {}} // Canlı projede test projesi butonu yok
                loading={loading}
              />
            </div>
          </div>
          
          {/* Test Project - Sağ */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm px-4 py-2 rounded-full font-bold z-10 shadow-lg">
              <Beaker size={14} className="inline mr-1" />
              TEST PROJESİ
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200 opacity-90">
              <ProjectCard
                project={testProject}
                showApiKey={showApiKey[testProject.id] || false}
                onToggleApiKey={() => onToggleApiKey(testProject.id)}
                onCopyApiKey={() => onCopyApiKey(testProject.apiKey)}
                onDelete={() => {}} // Test projesini silemez
                onNavigateToData={() => onNavigateToData(testProject.id)}
                onNavigateToEdit={() => onNavigateToEdit(testProject.id)}
                onToggleProtection={() => {}} // Test projesi koruması yok
                onCreateTestProject={() => {}} // Test projesi için test projesi yok
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Group Stats */}
      {isExpanded && (
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{project.tableCount || 0}</div>
              <div className="text-sm text-green-700 font-medium">Canlı Tablolar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{project.tableCount || 0}</div>
              <div className="text-sm text-purple-700 font-medium">Test Tabloları</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-blue-700 font-medium">Toplam Ortam</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGroup; 