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
  
  // Çok az kısıtlama - sadece tehlikeli karakterleri engelle
  if (/[<>'"&;\\\/\x00-\x1f\x7f]/.test(name)) {
    return 'Tablo adında güvenlik açısından tehlikeli karakterler kullanılamaz';
  }
  
  return null;
};

export const checkTableExists = (tables: any[], newTableName: string): boolean => {
  return tables.some(
    table => table.name.toLowerCase() === newTableName.trim().toLowerCase()
  );
}; 