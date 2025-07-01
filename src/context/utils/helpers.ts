// Generate unique ID with better uniqueness
export const generateUniqueId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const counter = Math.floor(Math.random() * 1000);
  return `${timestamp}-${random}-${counter}`;
};

// CLEAN DUPLICATES - BY ID AND NAME
export const cleanDuplicates = (items: any[]) => {
  if (!Array.isArray(items)) return [];
  const seenIds = new Set();
  const seenNames = new Set();
  return items.filter(item => {
    if (!item) return false;
    // Proje, tablo veya alanlarda hem id hem name ile kontrol
    const id = item.id;
    const name = (item.name || '').toLowerCase().trim();
    if ((id && seenIds.has(id)) || (name && seenNames.has(name))) return false;
    if (id) seenIds.add(id);
    if (name) seenNames.add(name);
    return true;
  });
};

// CLEAN ALL STORAGE - COMPLETE RESET
export const cleanAllStorage = () => {
  console.log('🧹 Cleaning all storage...');
  
  // Remove all project-related data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('all_projects') || key.includes('table_data_') || key === 'database_state') {
      localStorage.removeItem(key);
    }
  });
  
  // Initialize clean storage
  // localStorage removed - using only backend
}; 