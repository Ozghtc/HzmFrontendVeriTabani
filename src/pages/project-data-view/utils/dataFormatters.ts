export const formatDisplayValue = (value: any, type: string): string => {
  if (value === null || value === undefined) return '-';
  
  switch (type) {
    case 'boolean':
      return value ? 'Evet' : 'Hayır';
    case 'date':
      return new Date(value).toLocaleDateString('tr-TR');
    case 'object':
    case 'array':
      return typeof value === 'string' ? value : JSON.stringify(value);
    default:
      return String(value);
  }
};

export const parseFieldValue = (value: any, type: string): any => {
  switch (type) {
    case 'number':
      return Number(value) || 0;
    case 'boolean':
      return Boolean(value);
    case 'date':
      return value || new Date().toISOString().split('T')[0];
    case 'object':
    case 'array':
      return value || (type === 'object' ? '{}' : '[]');
    default:
      return value || '';
  }
};

export const createDefaultValue = (field: any): any => {
  switch (field.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'date':
      return new Date().toISOString().split('T')[0];
    case 'object':
      return '{}';
    case 'array':
      return '[]';
    default:
      return '';
  }
}; 