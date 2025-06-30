import React from 'react';
import { icons } from '../constants/apiKeyConstants';
import { METHOD_COLORS } from '../constants/apiKeyConstants';
import { ApiKeyGenerator } from '../../../utils/apiKeyGenerator';
import { Project } from '../../../types';

interface ApiExamplesProps {
  project: Project;
  show: boolean;
}

const ApiExamples: React.FC<ApiExamplesProps> = ({ project, show }) => {
  const { Code, ExternalLink } = icons;
  
  if (!show) return null;
  
  const apiExamples = ApiKeyGenerator.generateApiExamples(
    project.id, 
    project.apiKey,
    project.tables[0]?.name
  );
  
  const getMethodColor = (method: string) => {
    return METHOD_COLORS[method as keyof typeof METHOD_COLORS] || METHOD_COLORS.default;
  };
  
  return (
    <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
      <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
        <Code size={18} className="mr-2" />
        API Kullanım Örnekleri
      </h4>
      <div className="space-y-4">
        {Object.entries(apiExamples).map(([key, example]) => (
          <div key={key} className="bg-white border border-indigo-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">{example.description}</h5>
              <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(example.method)}`}>
                {example.method}
              </span>
            </div>
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
              <div className="text-green-400">curl -X {example.method} \</div>
              <div className="text-blue-400">  "{example.url}" \</div>
              <div className="text-yellow-400">  -H "Authorization: Bearer {ApiKeyGenerator.maskApiKey(project.apiKey)}" \</div>
              <div className="text-yellow-400">  -H "Content-Type: application/json"</div>
              {example.body && (
                <>
                  <div className="text-yellow-400">  -d '{JSON.stringify(example.body, null, 2).replace(/\n/g, '\n     ')}'</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <ExternalLink className="text-blue-600 mr-2" size={16} />
          <span className="text-sm text-blue-800">
            Detaylı API dokümantasyonu için: 
            <a 
              href={ApiKeyGenerator.generateApiDocUrl(project.id, project.apiKey)} 
              className="ml-1 underline hover:no-underline"
            >
              API Docs
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiExamples; 