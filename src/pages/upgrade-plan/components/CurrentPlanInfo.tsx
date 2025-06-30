import React from 'react';

interface CurrentPlanInfoProps {
  user: any;
  projectCount: number;
}

const CurrentPlanInfo: React.FC<CurrentPlanInfoProps> = ({ user, projectCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Mevcut Planınız</h2>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 capitalize">
              {user?.subscriptionType === 'free' ? 'Ücretsiz' : user?.subscriptionType}
            </span>
            <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {user?.maxProjects === -1 ? 'Sınırsız' : user?.maxProjects} Proje
            </span>
            <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {user?.maxTables === -1 ? 'Sınırsız' : user?.maxTables} Tablo
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Kullanım</p>
          <p className="text-lg font-semibold">
            {projectCount} / {user?.maxProjects === -1 ? '∞' : user?.maxProjects} Proje
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanInfo; 