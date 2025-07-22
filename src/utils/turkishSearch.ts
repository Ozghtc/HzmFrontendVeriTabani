/**
 * Türkçe-İngilizce karakter dönüşüm utility fonksiyonları
 * İstanbul -> Istanbul veya Istanbul -> İstanbul şeklinde arama desteği
 */

// Türkçe karakterlerin İngilizce karşılıkları
const TURKISH_TO_ENGLISH_MAP: Record<string, string> = {
  'ç': 'c', 'Ç': 'C',
  'ğ': 'g', 'Ğ': 'G', 
  'ı': 'i', 'I': 'I',
  'İ': 'I', 'i': 'i',
  'ö': 'o', 'Ö': 'O',
  'ş': 's', 'Ş': 'S',
  'ü': 'u', 'Ü': 'U'
};

// İngilizce karakterlerin Türkçe karşılıkları
const ENGLISH_TO_TURKISH_MAP: Record<string, string[]> = {
  'c': ['c', 'ç'], 'C': ['C', 'Ç'],
  'g': ['g', 'ğ'], 'G': ['G', 'Ğ'],
  'i': ['i', 'ı', 'İ'], 'I': ['I', 'İ', 'ı'],
  'o': ['o', 'ö'], 'O': ['O', 'Ö'],
  's': ['s', 'ş'], 'S': ['S', 'Ş'],
  'u': ['u', 'ü'], 'U': ['U', 'Ü']
};

/**
 * Metni Türkçe karakterlerden İngilizce karakterlere dönüştürür
 * @param text - Dönüştürülecek metin
 * @returns İngilizce karakterli metin
 */
export const turkishToEnglish = (text: string): string => {
  if (!text) return '';
  
  return text.split('').map(char => TURKISH_TO_ENGLISH_MAP[char] || char).join('');
};

/**
 * Arama terimi ile hedef metni karşılaştırır (Türkçe karakter desteği ile)
 * @param searchTerm - Arama terimi
 * @param targetText - Hedef metin
 * @returns Eşleşme durumu
 */
export const turkishSearch = (searchTerm: string, targetText: string): boolean => {
  if (!searchTerm || !targetText) return false;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const normalizedTarget = targetText.toLowerCase();
  
  // 1. Direkt eşleşme kontrolü
  if (normalizedTarget.includes(normalizedSearch)) {
    return true;
  }
  
  // 2. Türkçe -> İngilizce dönüşüm kontrolü
  const englishSearch = turkishToEnglish(normalizedSearch);
  const englishTarget = turkishToEnglish(normalizedTarget);
  
  if (englishTarget.includes(englishSearch)) {
    return true;
  }
  
  // 3. İngilizce -> Türkçe dönüşüm kontrolü (regex ile)
  const regexPattern = createTurkishRegexPattern(normalizedSearch);
  const regex = new RegExp(regexPattern, 'i');
  
  return regex.test(normalizedTarget);
};

/**
 * İngilizce karakterlerden Türkçe karakter alternatiflerini içeren regex pattern oluşturur
 * @param searchTerm - Arama terimi
 * @returns Regex pattern
 */
const createTurkishRegexPattern = (searchTerm: string): string => {
  return searchTerm
    .split('')
    .map(char => {
      const alternatives = ENGLISH_TO_TURKISH_MAP[char];
      if (alternatives) {
        return `[${alternatives.join('')}]`;
      }
      // Özel karakterleri escape et
      return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('');
};

/**
 * Metin içinde Türkçe karakter varyasyonlarını vurgular
 * @param text - Orijinal metin
 * @param searchTerm - Arama terimi
 * @param highlightClass - Vurgu CSS class'ı
 * @returns Vurgulanmış HTML string
 */
export const highlightTurkishSearch = (
  text: string, 
  searchTerm: string, 
  highlightClass: string = 'bg-yellow-200'
): string => {
  if (!searchTerm || !text) return text;
  
  const regexPattern = createTurkishRegexPattern(searchTerm.toLowerCase());
  const regex = new RegExp(`(${regexPattern})`, 'gi');
  
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};

/**
 * Çoklu arama terimi desteği
 * @param searchTerms - Arama terimleri dizisi
 * @param targetText - Hedef metin
 * @returns Herhangi bir terimin eşleşme durumu
 */
export const multiTurkishSearch = (searchTerms: string[], targetText: string): boolean => {
  if (!searchTerms.length || !targetText) return false;
  
  return searchTerms.some(term => turkishSearch(term, targetText));
};

/**
 * Arama önerisi oluşturucu (autocomplete için)
 * @param searchTerm - Arama terimi
 * @param suggestions - Öneri listesi
 * @param maxResults - Maksimum sonuç sayısı
 * @returns Filtrelenmiş öneriler
 */
export const getTurkishSuggestions = (
  searchTerm: string,
  suggestions: string[],
  maxResults: number = 10
): string[] => {
  if (!searchTerm) return suggestions.slice(0, maxResults);
  
  return suggestions
    .filter(suggestion => turkishSearch(searchTerm, suggestion))
    .slice(0, maxResults);
};

// Örnek kullanım ve test fonksiyonları
export const testTurkishSearch = () => {
  console.log('🧪 Türkçe Arama Testleri:');
  
  const testCases = [
    { search: 'istanbul', target: 'İstanbul', expected: true },
    { search: 'İstanbul', target: 'istanbul', expected: true },
    { search: 'ankara', target: 'Ankara', expected: true },
    { search: 'izmir', target: 'İzmir', expected: true },
    { search: 'çankaya', target: 'Cankaya', expected: true },
    { search: 'cankaya', target: 'Çankaya', expected: true },
    { search: 'göztepe', target: 'Goztepe', expected: true },
    { search: 'şişli', target: 'Sisli', expected: true },
  ];
  
  testCases.forEach(({ search, target, expected }) => {
    const result = turkishSearch(search, target);
    console.log(`${result === expected ? '✅' : '❌'} "${search}" -> "${target}": ${result}`);
  });
}; 