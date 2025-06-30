export const dataTypes = [
  { value: 'string', label: 'Metin (String)', icon: '📝' },
  { value: 'number', label: 'Sayı (Number)', icon: '🔢' },
  { value: 'boolean', label: 'Boolean', icon: '☑️' },
  { value: 'date', label: 'Tarih (Date)', icon: '📅' },
  { value: 'object', label: 'Nesne (Object)', icon: '🗂️' },
  { value: 'array', label: 'Dizi (Array)', icon: '📋' },
  { value: 'relation', label: 'İlişki (Relation)', icon: '🔗' },
  { value: 'currency', label: 'Para Birimi (Currency)', icon: '💰' },
  { value: 'weight', label: 'Ağırlık (Weight)', icon: '⚖️' },
];

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

// Helper functions
export const getTypeIcon = (type: string) => {
  const typeData = dataTypes.find(t => t.value === type);
  return typeData?.icon || '📄';
};

export const getTypelabel = (type: string) => {
  const typeData = dataTypes.find(t => t.value === type);
  return typeData?.label || type;
}; 