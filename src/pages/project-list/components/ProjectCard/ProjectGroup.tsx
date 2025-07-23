import React, { useState, useCallback, useMemo } from 'react';
import { icons } from '../../constants/projectListConstants';
import { TestTube, ArrowRight, Link, Play, Beaker } from 'lucide-react';
import ProjectCard from './index';
import { ApiKeyGenerator } from '../../../../utils/apiKeyGenerator';
import ProjectInfoModal from './ProjectInfoModal';
import { NewProjectLogsModal } from '../../../../components/modals/NewProjectLogsModal';

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
  const [isExpanded, setIsExpanded] = useState(false); // Varsayılan kapalı
  
  // Modal state'leri
  const [isLiveInfoOpen, setIsLiveInfoOpen] = useState(false);
  const [isLiveLogsOpen, setIsLiveLogsOpen] = useState(false);
  const [isTestInfoOpen, setIsTestInfoOpen] = useState(false);
  const [isTestLogsOpen, setIsTestLogsOpen] = useState(false);
  
  // Test projesi için benzersiz API key oluştur
  const generateTestApiKey = useCallback(() => {
    // Test projesi için özel prefix ile API key oluştur
    const testPrefix = 'test_hzm_';
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    const projectHash = Math.abs(project.id).toString(36);
    
    return `${testPrefix}${timestamp}_${randomPart}_${projectHash}`;
  }, [project.id]);
  
  // Test projesi klonu oluştur
  const testProject = useMemo(() => ({
    ...project,
    id: project.id + 10000, // Test projesi için benzersiz ID
    name: `${project.name} - Test`,
    description: `Test ortamı: ${project.description || project.name}`,
    apiKey: generateTestApiKey(), // Benzersiz test API key
    isTestEnvironment: true,
    tableCount: project.tableCount // Aynı tablo sayısı
  }), [project, generateTestApiKey]);
  
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-xl shadow-xl border-2 border-blue-300 p-6 mb-6">
        {/* Group Header - Tek Satırda Hepsi */}
        <div className="flex items-center justify-between mb-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            {/* Proje Adı */}
            <h2 className="text-xl font-bold text-gray-800">
              📊 {project.name}
            </h2>
            
            {/* Yeşil Top */}
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            
            {/* Canlı Hızlı Erişim */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-green-700">CANLI</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onNavigateToData(project.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                >
                  Veri
                </button>
                <button
                  onClick={() => onNavigateToEdit(project.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                >
                  Düzen
                </button>
                <button
                  onClick={() => setIsLiveInfoOpen(true)}
                  className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-orange-600 transition-colors"
                >
                  Bilgi
                </button>
                <button
                  onClick={() => setIsLiveLogsOpen(true)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  Logs
                </button>
              </div>
            </div>
            
            {/* Mor Top */}
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            
            {/* Test Hızlı Erişim */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-purple-700">TEST</span>
              <div className="flex gap-1">
                <button
                  onClick={() => onNavigateToData(testProject.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                >
                  Veri
                </button>
                <button
                  onClick={() => onNavigateToEdit(testProject.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                >
                  Düzen
                </button>
                <button
                  onClick={() => setIsTestInfoOpen(true)}
                  className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-orange-600 transition-colors"
                >
                  Bilgi
                </button>
                <button
                  onClick={() => setIsTestLogsOpen(true)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  Logs
                </button>
              </div>
            </div>
          </div>
          
          {/* Ok Tuşu */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
          >
            <ArrowRight 
              size={18} 
              className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
        
        {/* Connection Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-blue-200 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-blue-700">
              <Link size={16} className="mr-3" />
              <span className="font-semibold">Bağlantı Durumu:</span>
              <span className="ml-2 text-blue-600">
                Test ortamı canlı projeye bağlı - Aynı tablolar, ayrı veriler
              </span>
            </div>
            
            <div className="flex items-center text-sm text-purple-700 bg-purple-50 px-3 py-2 rounded-lg">
              <TestTube size={16} className="mr-3" />
              <span className="font-semibold">API Güvenliği:</span>
              <span className="ml-2 text-purple-600">
                Test projesi farklı API key kullanır - Veriler canlıya karışmaz
              </span>
            </div>
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
                  project={{
                    ...testProject,
                    isProtected: project.isProtected, // Parent projenin koruma durumunu kopyala
                    isTestEnvironment: true // Test projesi olduğunu belirt
                  }}
                  showApiKey={showApiKey[testProject.id] || false}
                  onToggleApiKey={() => onToggleApiKey(testProject.id)}
                  onCopyApiKey={() => onCopyApiKey(testProject.apiKey)}
                  onDelete={() => onDelete(testProject.id)} // Test projesi silinebilir (koruma durumuna göre)
                  onNavigateToData={() => onNavigateToData(testProject.id)}
                  onNavigateToEdit={() => onNavigateToEdit(testProject.id)}
                  onToggleProtection={() => {}} // Test projesi kendi koruması yok - boş function
                  onCreateTestProject={() => {}} // Test projesi için test projesi yok
                  loading={loading}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Group Stats */}
        {isExpanded && (
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{project.tableCount || 5}</div>
                <div className="text-sm text-green-700 font-medium">Canlı Tablolar</div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{testProject.tableCount || 5}</div>
                <div className="text-sm text-purple-700 font-medium">Test Tabloları</div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-blue-700 font-medium">Toplam Ortam</div>
              </div>
            </div>
            
            {/* API Key Comparison */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-600 font-medium mb-2">🔑 API Key Karşılaştırması:</div>
              <div className="grid md:grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 px-2 py-1 rounded">
                  <span className="font-medium text-green-800">Canlı:</span>
                  <span className="ml-1 text-green-600 font-mono">
                    {project.apiKey.substring(0, 12)}...{project.apiKey.slice(-4)}
                  </span>
                </div>
                <div className="bg-purple-100 px-2 py-1 rounded">
                  <span className="font-medium text-purple-800">Test:</span>
                  <span className="ml-1 text-purple-600 font-mono">
                    {testProject.apiKey.substring(0, 12)}...{testProject.apiKey.slice(-4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modallar - En Önde Görünecek */}
      {/* Canlı Proje Info Modal */}
      <ProjectInfoModal
        isOpen={isLiveInfoOpen}
        onClose={() => setIsLiveInfoOpen(false)}
        project={project}
      />

      {/* Canlı Proje Logs Modal */}
      {isLiveLogsOpen && (
        <NewProjectLogsModal
          project={project}
          onClose={() => setIsLiveLogsOpen(false)}
        />
      )}

      {/* Test Proje Info Modal */}
      <ProjectInfoModal
        isOpen={isTestInfoOpen}
        onClose={() => setIsTestInfoOpen(false)}
        project={testProject}
      />

      {/* Test Proje Logs Modal */}
      {isTestLogsOpen && (
        <NewProjectLogsModal
          project={testProject}
          onClose={() => setIsTestLogsOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectGroup; 