import { Project } from '../types/projectListTypes';

export const validateProjectName = (name: string, projects: Project[]): string | null => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return 'Proje adı boş olamaz';
  }
  
  const exists = projects.some(
    project => project.name.toLowerCase() === trimmedName.toLowerCase()
  );
  
  if (exists) {
    return 'Bu isimde bir proje zaten mevcut. Lütfen farklı bir isim seçin.';
  }
  
  if (trimmedName.length < 3) {
    return 'Proje adı en az 3 karakter olmalıdır';
  }
  
  if (trimmedName.length > 50) {
    return 'Proje adı en fazla 50 karakter olabilir';
  }
  
  return null;
}; 