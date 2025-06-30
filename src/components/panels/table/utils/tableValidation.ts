export const validateTableName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Tablo adı boş olamaz';
  }
  
  if (name.length < 2) {
    return 'Tablo adı en az 2 karakter olmalıdır';
  }
  
  if (name.length > 50) {
    return 'Tablo adı en fazla 50 karakter olabilir';
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    return 'Tablo adı harf ile başlamalı ve sadece harf, rakam ve alt çizgi içermelidir';
  }
  
  return null;
};

export const checkTableExists = (tables: any[], newTableName: string): boolean => {
  return tables.some(
    table => table.name.toLowerCase() === newTableName.trim().toLowerCase()
  );
}; 