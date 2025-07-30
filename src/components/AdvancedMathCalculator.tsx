import React, { useState } from 'react';
import { Calculator, Grid3X3, BarChart3, DollarSign, Atom, ArrowLeftRight, ChevronRight } from 'lucide-react';
import MatrixCalculator from './math/MatrixCalculator';
import StatisticsCalculator from './math/StatisticsCalculator';
import FinanceCalculator from './math/FinanceCalculator';
import ScienceCalculator from './math/ScienceCalculator';
import UnitConverter from './math/UnitConverter';

interface MathCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  count: number;
}

const AdvancedMathCalculator: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('overview');

  const categories: MathCategory[] = [
    {
      id: 'matrix',
      title: 'Matrix İşlemleri',
      description: 'Matrix toplama, çarpma, determinant hesaplama',
      icon: <Grid3X3 size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      count: 3
    },
    {
      id: 'statistics',
      title: 'İstatistiksel Analiz',
      description: 'Ortalama, medyan, korelasyon, regresyon analizi',
      icon: <BarChart3 size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      count: 19
    },
    {
      id: 'finance',
      title: 'Finansal Matematik',
      description: 'Faiz hesaplamaları, ROI, kredi ödemeleri',
      icon: <DollarSign size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      count: 9
    },
    {
      id: 'science',
      title: 'Bilimsel Hesaplamalar',
      description: 'Kimya, fizik ve bilimsel formüller',
      icon: <Atom size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',  
      count: 7
    },
    {
      id: 'units',
      title: 'Birim Dönüştürücü',
      description: 'Sıcaklık, uzunluk, ağırlık dönüştürmeleri',
      icon: <ArrowLeftRight size={24} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      count: 15
    }
  ];

  const renderCategoryOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calculator className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Gelişmiş Matematik Hesaplayıcı</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Profesyonel matematik, istatistik, finans ve bilim hesaplamaları
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`${category.bgColor} rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow-sm`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${category.color} p-3 rounded-lg bg-white shadow-sm`}>
                {category.icon}
              </div>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                {category.count} işlem
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {category.title}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Hesaplamaya başla</span>
              <ChevronRight className={`${category.color}`} size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">HZMSoft Matematik API</h3>
            <p className="text-indigo-100">
              53 farklı matematik işlemi • 3-katmanlı güvenlik • Real-time hesaplama
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">53</div>
            <div className="text-indigo-200">Toplam İşlem</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackButton = () => (
    <button
      onClick={() => setActiveCategory('overview')}
      className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <ChevronRight className="rotate-180" size={16} />
      <span>Kategorilere Dön</span>
    </button>
  );

  const renderActiveComponent = () => {
    switch (activeCategory) {
      case 'matrix':
        return (
          <div>
            {renderBackButton()}
            <MatrixCalculator />
          </div>
        );
      case 'statistics':
        return (
          <div>
            {renderBackButton()}
            <StatisticsCalculator />
          </div>
        );
      case 'finance':
        return (
          <div>
            {renderBackButton()}
            <FinanceCalculator />
          </div>
        );
      case 'science':
        return (
          <div>
            {renderBackButton()}
            <ScienceCalculator />
          </div>
        );
      case 'units':
        return (
          <div>
            {renderBackButton()}
            <UnitConverter />
          </div>
        );
      default:
        return renderCategoryOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AdvancedMathCalculator; 