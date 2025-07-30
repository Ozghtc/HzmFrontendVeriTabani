// 🧮 MATEMATİKSEL GRUPLARA AYRILMIŞ FIELD TYPE'LARI

export const fieldTypeGroups = {
  // 🔢 TEMEl VERİ TİPLERİ
  basic: {
    title: 'Temel Veri Tipleri',
    icon: '📄',
    types: [
      { value: 'string', label: 'Metin (String)', icon: '📝', mathCapable: false },
      { value: 'text', label: 'Uzun Metin (Text)', icon: '📜', mathCapable: false },
      { value: 'boolean', label: 'Boolean', icon: '☑️', mathCapable: false },
      { value: 'date', label: 'Tarih (Date)', icon: '📅', mathCapable: true }, // Date math
      { value: 'object', label: 'Nesne (Object)', icon: '🗂️', mathCapable: false },
      { value: 'array', label: 'Dizi (Array)', icon: '📋', mathCapable: true }, // Array operations
    ]
  },

  // 🧮 MATEMATİKSEL VERİ TİPLERİ
  mathematical: {
    title: 'Matematiksel Veri Tipleri',
    icon: '🧮',
    types: [
      { value: 'number', label: 'Sayı (Number)', icon: '🔢', mathCapable: true },
      { value: 'integer', label: 'Tam Sayı (Integer)', icon: '🔢', mathCapable: true },
      { value: 'float', label: 'Ondalık Sayı (Float)', icon: '🔢', mathCapable: true },
      { value: 'decimal', label: 'Hassas Ondalık (Decimal)', icon: '🔢', mathCapable: true },
      { value: 'percentage', label: 'Yüzde (Percentage)', icon: '📊', mathCapable: true },
      { value: 'ratio', label: 'Oran (Ratio)', icon: '⚖️', mathCapable: true },
    ]
  },

  // 🎲 MATRİX VE ÇOK BOYUTLU VERİ TİPLERİ
  matrix: {
    title: 'Matrix ve Çok Boyutlu Veri Tipleri',
    icon: '🎲',
    types: [
      { value: 'matrix', label: 'Matrix', icon: '🔳', mathCapable: true },
      { value: 'vector', label: 'Vektör', icon: '➡️', mathCapable: true },
      { value: 'tensor', label: 'Tensör', icon: '🎯', mathCapable: true },
      { value: 'coordinates', label: 'Koordinat', icon: '📍', mathCapable: true },
      { value: 'dataset', label: 'Veri Seti', icon: '📊', mathCapable: true },
    ]
  },

  // 💰 FİNANSAL VERİ TİPLERİ
  financial: {
    title: 'Finansal Veri Tipleri',
    icon: '💰',
    types: [
      { value: 'currency', label: 'Para Birimi (Currency)', icon: '💰', mathCapable: true },
      { value: 'price', label: 'Fiyat (Price)', icon: '💵', mathCapable: true },
      { value: 'tax', label: 'Vergi (Tax)', icon: '📊', mathCapable: true },
      { value: 'discount', label: 'İndirim (Discount)', icon: '🏷️', mathCapable: true },
      { value: 'interest', label: 'Faiz (Interest)', icon: '📈', mathCapable: true },
    ]
  },

  // 📏 FİZİKSEL ÖLÇÜM TİPLERİ
  measurement: {
    title: 'Fiziksel Ölçüm Tipleri',
    icon: '📏',
    types: [
      { value: 'weight', label: 'Ağırlık (Weight)', icon: '⚖️', mathCapable: true },
      { value: 'length', label: 'Uzunluk (Length)', icon: '📏', mathCapable: true },
      { value: 'area', label: 'Alan (Area)', icon: '⬜', mathCapable: true },
      { value: 'volume', label: 'Hacim (Volume)', icon: '🧊', mathCapable: true },
      { value: 'temperature', label: 'Sıcaklık (Temperature)', icon: '🌡️', mathCapable: true },
      { value: 'speed', label: 'Hız (Speed)', icon: '🏃', mathCapable: true },
    ]
  },

  // ⏱️ ZAMAN VE TARİH TİPLERİ
  temporal: {
    title: 'Zaman ve Tarih Tipleri',
    icon: '⏱️',
    types: [
      { value: 'datetime', label: 'Tarih-Saat (DateTime)', icon: '📅', mathCapable: true },
      { value: 'time', label: 'Saat (Time)', icon: '⏰', mathCapable: true },
      { value: 'duration', label: 'Süre (Duration)', icon: '⏱️', mathCapable: true },
      { value: 'age', label: 'Yaş (Age)', icon: '🎂', mathCapable: true },
      { value: 'timestamp', label: 'Zaman Damgası (Timestamp)', icon: '⏰', mathCapable: true },
    ]
  },

  // 📊 İSTATİSTİKSEL VERİ TİPLERİ
  statistical: {
    title: 'İstatistiksel Veri Tipleri',
    icon: '📊',
    types: [
      { value: 'score', label: 'Puan (Score)', icon: '🎯', mathCapable: true },
      { value: 'rating', label: 'Değerlendirme (Rating)', icon: '⭐', mathCapable: true },
      { value: 'rank', label: 'Sıralama (Rank)', icon: '🏆', mathCapable: true },
      { value: 'probability', label: 'Olasılık (Probability)', icon: '🎲', mathCapable: true },
      { value: 'frequency', label: 'Frekans (Frequency)', icon: '📈', mathCapable: true },
    ]
  },

  // 🔗 İLİŞKİSEL VERİ TİPLERİ
  relational: {
    title: 'İlişkisel Veri Tipleri',
    icon: '🔗',
    types: [
      { value: 'foreign_key', label: 'Yabancı Anahtar (Foreign Key)', icon: '🔑', mathCapable: false },
      { value: 'relationship', label: 'İlişki (Relationship)', icon: '🔗', mathCapable: false },
      { value: 'reference', label: 'Referans (Reference)', icon: '🗝️', mathCapable: false },
    ]
  }
};

// Geriye uyumluluk için eski format
export const dataTypes = Object.values(fieldTypeGroups)
  .flatMap(group => group.types)
  .map(type => ({
    value: type.value,
    label: type.label,
    icon: type.icon
  }));

export const currencies = [
  { value: 'TRY', label: 'Türk Lirası (₺)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
];

export const weightUnits = [
  { value: 'g', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'lb', label: 'Pound (lb)' },
  { value: 'oz', label: 'Ounce (oz)' },
  { value: 't', label: 'Ton (t)' },
];

export const relationshipTypes = [
  { value: 'one-to-one', label: 'Bire Bir (1:1)', icon: '🔗' },
  { value: 'one-to-many', label: 'Bire Çok (1:N)', icon: '🔗📋' },
  { value: 'many-to-many', label: 'Çoka Çok (N:N)', icon: '🔗🔗' },
];

// 🧮 MATEMATİKSEL HELPER FUNCTIONS
export const getTypeIcon = (type: string) => {
  const typeData = dataTypes.find(t => t.value === type);
  return typeData?.icon || '📄';
};

export const getTypelabel = (type: string) => {
  const typeData = dataTypes.find(t => t.value === type);
  return typeData?.label || type;
};

// Matematiksel işlem yapabilen field'ları filtrele
export const getMathCapableTypes = () => {
  return Object.values(fieldTypeGroups)
    .flatMap(group => group.types)
    .filter(type => type.mathCapable);
};

// Field type'ın hangi gruba ait olduğunu bul
export const getFieldTypeGroup = (fieldType: string) => {
  for (const [groupKey, group] of Object.entries(fieldTypeGroups)) {
    if (group.types.some(type => type.value === fieldType)) {
      return { key: groupKey, ...group };
    }
  }
  return null;
};

// Matematiksel işlem yapabilen mi kontrol et
export const isMathCapable = (fieldType: string) => {
  const allTypes = Object.values(fieldTypeGroups).flatMap(group => group.types);
  const type = allTypes.find(t => t.value === fieldType);
  return type?.mathCapable || false;
};

// Gruba göre field type'ları getir
export const getTypesByGroup = (groupKey: string) => {
  return (fieldTypeGroups as any)[groupKey]?.types || [];
};

// Matematiksel operasyon yapılabilir field çiftlerini bul
export const getCompatibleMathTypes = (type1: string, type2: string) => {
  const group1 = getFieldTypeGroup(type1);
  const group2 = getFieldTypeGroup(type2);
  
  // Aynı grup içindeki tipler uyumlu
  if (group1?.key === group2?.key) return true;
  
  // Finansal + Matematiksel uyumlu
  if ((group1?.key === 'financial' && group2?.key === 'mathematical') ||
      (group1?.key === 'mathematical' && group2?.key === 'financial')) return true;
  
  // Ölçüm + Matematiksel uyumlu  
  if ((group1?.key === 'measurement' && group2?.key === 'mathematical') ||
      (group1?.key === 'mathematical' && group2?.key === 'measurement')) return true;
      
  return false;
}; 