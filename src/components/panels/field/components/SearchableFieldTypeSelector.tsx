import React, { useState, useRef, useEffect } from 'react';
import { fieldTypeGroups } from '../constants/fieldConstants';

interface SearchableFieldTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  showMathCapableOnly?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchableFieldTypeSelector: React.FC<SearchableFieldTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  showMathCapableOnly = false,
  placeholder = "🔍 Field type ara...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['basic', 'mathematical']);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Arama terimini temizle ve seçilen tipi göster
  const getDisplayValue = () => {
    if (selectedType) {
      const allTypes = Object.values(fieldTypeGroups).flatMap(group => group.types);
      const type = allTypes.find(t => t.value === selectedType);
      return type ? `${type.icon} ${type.label}` : selectedType;
    }
    return '';
  };

  // Grupları filtrele
  const filteredGroups = Object.entries(fieldTypeGroups).map(([key, group]) => {
    let types = showMathCapableOnly 
      ? group.types.filter(type => type.mathCapable)
      : group.types;
    
    // Arama filtresi
    if (searchTerm) {
      types = types.filter(type => 
        type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return {
      key,
      ...group,
      types,
      count: types.length
    };
  }).filter(group => group.types.length > 0);

  // Grup genişletme/daraltma
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupKey)
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  // Tip seçimi
  const handleTypeSelect = (typeValue: string) => {
    onTypeSelect(typeValue);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // Arama değişikliği
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Arama yaparken dropdown otomatik açılsın
    if (value && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }
    
    // Arama varsa tüm grupları genişlet
    if (value) {
      setExpandedGroups(filteredGroups.map(g => g.key));
    }
  };

  // Dışarı tıklama ile kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 🔍 ARAMA KUTUSU - MOBİL SABİT, DOKUNMATIK UYUMLU */}
      <div className="mb-2 sticky top-0 z-10 bg-white">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white touch-manipulation"
          style={{ fontSize: '16px' }} // iOS zoom engelleyici
        />
      </div>

      {/* 📦 SEÇILEN TİP GÖSTERGE - MOBİL UYUMLU */}
      {selectedType && !searchTerm && (
        <div 
          className="w-full px-4 py-3 sm:py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 active:bg-blue-200 transition-colors duration-200 mb-2 touch-manipulation"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium text-sm sm:text-xs truncate pr-2">
              {getDisplayValue()}
            </span>
            <span className="text-blue-600 text-lg sm:text-base flex-shrink-0">
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </div>
        </div>
      )}

      {/* 📋 DROPDOWN LİSTESİ - MOBİL RESPONSIVE */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 sm:max-h-96 overflow-y-auto overscroll-contain">
          {filteredGroups.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="text-4xl sm:text-3xl mb-2">🔍</div>
              <div className="text-sm sm:text-xs">
                "{searchTerm}" için sonuç bulunamadı
              </div>
            </div>
          ) : (
            filteredGroups.map(({ key, title, icon, types, count }) => (
              <div key={key} className="border-b border-gray-100 last:border-b-0">
                {/* GRUP BAŞLIĞI - MOBİL DOKUNMATIK */}
                <button
                  type="button"
                  className="flex items-center justify-between w-full px-4 py-4 sm:py-3 text-left font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:bg-gray-100 touch-manipulation"
                  onClick={() => toggleGroup(key)}
                >
                  <span className="flex items-center min-w-0 flex-1">
                    <span className="mr-3 text-xl sm:text-lg flex-shrink-0">{icon}</span>
                    <span className="text-base sm:text-sm truncate">{title}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full flex-shrink-0">
                      {count}
                    </span>
                  </span>
                  <span className="text-gray-500 text-lg sm:text-base ml-2 flex-shrink-0">
                    {expandedGroups.includes(key) ? '▲' : '▼'}
                  </span>
                </button>

                {/* GRUP İÇERİĞİ - MOBİL UYUMLU */}
                {expandedGroups.includes(key) && (
                  <div className="bg-white">
                    {types.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        className={`flex items-center w-full px-6 py-4 sm:py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200 focus:outline-none focus:bg-blue-50 touch-manipulation ${
                          selectedType === type.value 
                            ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-500' 
                            : 'text-gray-700'
                        }`}
                        onClick={() => handleTypeSelect(type.value)}
                      >
                        <span className="mr-3 text-lg sm:text-base flex-shrink-0">
                          {type.icon}
                        </span>
                        <span className="flex-1 text-sm sm:text-xs min-w-0 truncate pr-2">
                          {type.label}
                        </span>
                        {type.mathCapable && (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full flex-shrink-0">
                            <span className="hidden sm:inline">🧮 Math</span>
                            <span className="sm:hidden">🧮</span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 📱 MOBİL OVERLAY (Dropdown açıkken arka planı karart) */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
          onClick={() => {
            setIsDropdownOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
}; 