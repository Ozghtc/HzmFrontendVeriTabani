import React, { useState } from 'react';
import { fieldTypeGroups, isMathCapable } from '../constants/fieldConstants';

interface GroupedFieldTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  showMathCapableOnly?: boolean;
}

export const GroupedFieldTypeSelector: React.FC<GroupedFieldTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  showMathCapableOnly = false
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['basic', 'mathematical']);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  const filteredGroups = Object.entries(fieldTypeGroups).map(([key, group]) => ({
    key,
    ...group,
    types: showMathCapableOnly 
      ? group.types.filter(type => type.mathCapable)
      : group.types
  })).filter(group => group.types.length > 0);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-3">
        {showMathCapableOnly ? '🧮 Matematiksel İşlem Yapabilen Tipler' : '📋 Veri Tipi Seçin'}
      </div>
      
      {filteredGroups.map(group => (
        <div key={group.key} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Group Header */}
          <button
            onClick={() => toggleGroup(group.key)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{group.icon}</span>
              <span className="font-medium text-gray-800">{group.title}</span>
              <span className="text-sm text-gray-500">({group.types.length})</span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${
                expandedGroups.includes(group.key) ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Group Content */}
          {expandedGroups.includes(group.key) && (
            <div className="p-2 bg-white">
              <div className="grid grid-cols-1 gap-1">
                {group.types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => onTypeSelect(type.value)}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all
                      ${selectedType === type.value
                        ? 'bg-blue-100 border-blue-300 text-blue-800 border'
                        : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">({type.value})</span>
                        {type.mathCapable && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🧮 Math
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Math Capability Filter Toggle */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showMathCapableOnly}
            onChange={(e) => {
              // Bu prop olarak geldiği için parent component'te handle edilmeli
              console.log('Math filter toggle:', e.target.checked);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            🧮 Sadece matematiksel işlem yapabilen tipleri göster
          </span>
        </label>
      </div>

      {/* Selected Type Info */}
      {selectedType && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm font-medium text-green-800 mb-2">
            ✅ Seçili Tip: {selectedType}
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <span>Matematiksel İşlem:</span>
            {isMathCapable(selectedType) ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Destekleniyor
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                ❌ Desteklenmiyor
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 