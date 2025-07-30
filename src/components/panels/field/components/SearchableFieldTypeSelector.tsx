import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Calculator, DollarSign, Clock, BarChart3, Link, Zap } from 'lucide-react';
import { fieldTypeGroups } from '../constants/fieldConstants';

interface SearchableFieldTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  showMathCapableOnly?: boolean;
  placeholder?: string;
  className?: string;
}

// 🎨 KATEGORI RENK SİSTEMİ - ONAYLANMIŞ TASARIM
const categoryColors = {
  basic: {
    bg: 'bg-gradient-to-r from-slate-50 to-slate-100',
    border: 'border-l-slate-500',
    text: 'text-slate-700',
    icon: '📝',
    lucideIcon: Zap
  },
  mathematical: {
    bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
    border: 'border-l-blue-500',
    text: 'text-blue-700',
    icon: '🧮',
    lucideIcon: Calculator
  },
  financial: {
    bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
    border: 'border-l-emerald-500',
    text: 'text-emerald-700',
    icon: '💰',
    lucideIcon: DollarSign
  },
  physical_measurement: {
    bg: 'bg-gradient-to-r from-orange-50 to-orange-100',
    border: 'border-l-orange-500',
    text: 'text-orange-700',
    icon: '📏',
    lucideIcon: BarChart3
  },
  time_and_date: {
    bg: 'bg-gradient-to-r from-purple-50 to-purple-100',
    border: 'border-l-purple-500',
    text: 'text-purple-700',
    icon: '⏰',
    lucideIcon: Clock
  },
  statistical: {
    bg: 'bg-gradient-to-r from-red-50 to-red-100',
    border: 'border-l-red-500',
    text: 'text-red-700',
    icon: '📊',
    lucideIcon: BarChart3
  },
  relational: {
    bg: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    border: 'border-l-indigo-500',
    text: 'text-indigo-700',
    icon: '🔗',
    lucideIcon: Link
  }
};

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

  // Seçili tipi göster
  const getDisplayValue = () => {
    if (selectedType) {
      const allTypes = Object.values(fieldTypeGroups).flatMap(group => group.types);
      const type = allTypes.find(t => t.value === selectedType);
      return type ? `${type.icon} ${type.label}` : selectedType;
    }
    return '';
  };

  // Grupları filtrele ve renklendir
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
      count: types.length,
      colors: categoryColors[key as keyof typeof categoryColors] || categoryColors.basic
    };
  }).filter(group => group.types.length > 0);

  // 🎬 SMOOTH GRUP TOGGLE - 200-300ms ANİMASYON
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

  // 🔍 GELİŞMİŞ ARAMA - GRUP OTOMATIK AÇMA
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }
    
    // Arama varsa eşleşen grupları otomatik aç
    if (value) {
      const matchingGroups = filteredGroups
        .filter(group => group.types.length > 0)
        .map(group => group.key);
      setExpandedGroups(matchingGroups);
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
      {/* 🔍 ARAMA KUTUSU - MOBİL ÖNCELIK TASARIM */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white shadow-sm hover:shadow-md touch-manipulation"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* 📦 SEÇİLİ TİP GÖSTERGE - PROFESYONEL TASARIM */}
      {selectedType && !searchTerm && (
        <div 
          className="w-full px-4 py-3 sm:py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl cursor-pointer hover:from-blue-100 hover:to-indigo-100 active:from-blue-200 active:to-indigo-200 transition-all duration-200 mb-3 shadow-sm touch-manipulation"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-semibold text-sm sm:text-xs truncate pr-2">
              {getDisplayValue()}
            </span>
            <div className="flex-shrink-0">
              {isDropdownOpen ? (
                <ChevronUp className="h-5 w-5 text-blue-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 📋 DROPDOWN - PROFESYONEL RENK SİSTEMİ */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 sm:max-h-96 overflow-y-auto overscroll-contain backdrop-blur-sm">
          {filteredGroups.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <div className="text-4xl sm:text-3xl mb-3">🔍</div>
              <div className="text-sm sm:text-xs font-medium">
                "{searchTerm}" için sonuç bulunamadı
              </div>
            </div>
          ) : (
            filteredGroups.map(({ key, title, types, count, colors }) => (
              <div key={key} className="border-b border-gray-100 last:border-b-0">
                {/* 🎨 GRUP BAŞLIĞI - RENK SİSTEMİ + LUCIDE İKONLAR */}
                <button
                  type="button"
                  className={`flex items-center justify-between w-full px-5 py-4 sm:py-3.5 text-left font-black ${colors.bg} ${colors.border} border-l-4 hover:shadow-md active:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 touch-manipulation group`}
                  onClick={() => toggleGroup(key)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="mr-3 flex items-center space-x-2">
                      <span className="text-xl sm:text-lg">{colors.icon}</span>
                      <colors.lucideIcon className={`h-4 w-4 ${colors.text} opacity-70`} />
                    </div>
                    <span className={`text-lg sm:text-base font-black ${colors.text} truncate tracking-wide`}>
                      {title}
                    </span>
                    <div className={`ml-3 px-3 py-1.5 text-xs ${colors.text} bg-white bg-opacity-80 rounded-full flex-shrink-0 font-black shadow-sm border border-white border-opacity-50`}>
                      {count}
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 transition-transform duration-200">
                    {expandedGroups.includes(key) ? (
                      <ChevronUp className={`h-5 w-5 ${colors.text} group-hover:scale-110`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 ${colors.text} group-hover:scale-110`} />
                    )}
                  </div>
                </button>

                {/* 🎬 SMOOTH ACCORDION İÇERİK - 250ms ANİMASYON */}
                <div 
                  className={`overflow-hidden transition-all duration-250 ease-in-out ${
                    expandedGroups.includes(key) 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="bg-white bg-opacity-80">
                    {types.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        className={`flex items-center w-full pl-8 pr-5 py-3.5 sm:py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 active:from-blue-100 active:to-indigo-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 touch-manipulation group ${
                          selectedType === type.value 
                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-r-4 border-blue-500 shadow-sm' 
                            : 'text-gray-700'
                        }`}
                        onClick={() => handleTypeSelect(type.value)}
                      >
                        <span className="mr-3 text-lg sm:text-base flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                          {type.icon}
                        </span>
                        <span className="flex-1 text-sm sm:text-xs font-normal min-w-0 truncate pr-2">
                          {type.label}
                        </span>
                        {type.mathCapable && (
                          <div className="ml-2 px-2.5 py-1 text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full flex-shrink-0 font-semibold border border-green-200">
                            <span className="hidden sm:inline flex items-center space-x-1">
                              <Calculator className="h-3 w-3" />
                              <span>Math</span>
                            </span>
                            <span className="sm:hidden">🧮</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 📱 MOBİL OVERLAY - PROFESYONEL BLUR EFEKTİ */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-200"
          onClick={() => {
            setIsDropdownOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};
