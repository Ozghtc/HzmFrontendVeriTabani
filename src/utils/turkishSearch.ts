/**
 * Türkçe-İngilizce karakter dönüşüm utility fonksiyonları
 * İstanbul -> Istanbul veya Istanbul -> İstanbul şeklinde arama desteği
 */

// Türkçe karakterlerin İngilizce karşılıkları (case-insensitive)
const TURKISH_TO_ENGLISH_MAP: Record<string, string> = {
  'ç': 'c', 'Ç': 'c',
  'ğ': 'g', 'Ğ': 'g', 
  'ı': 'i', 'I': 'i',
  'İ': 'i', 'i': 'i',
  'ö': 'o', 'Ö': 'o',
  'ş': 's', 'Ş': 's',
  'ü': 'u', 'Ü': 'u'
};

// İngilizce karakterlerin Türkçe karşılıkları (case-insensitive)
const ENGLISH_TO_TURKISH_MAP: Record<string, string[]> = {
  'c': ['c', 'ç', 'C', 'Ç'],
  'g': ['g', 'ğ', 'G', 'Ğ'],
  'i': ['i', 'ı', 'İ', 'I'],
  'o': ['o', 'ö', 'O', 'Ö'],
  's': ['s', 'ş', 'S', 'Ş'],
  'u': ['u', 'ü', 'U', 'Ü']
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
  
  // 3. Regex ile kapsamlı karakter eşleştirme
  try {
    const regexPattern = createTurkishRegexPattern(normalizedSearch);
    const regex = new RegExp(regexPattern, 'gi'); // global ve case-insensitive
    return regex.test(normalizedTarget);
  } catch (error) {
    console.warn('Regex pattern error:', error);
    // Regex hata verirse fallback olarak basit arama yap
    return normalizedTarget.includes(normalizedSearch);
  }
};

/**
 * İngilizce karakterlerden Türkçe karakter alternatiflerini içeren regex pattern oluşturur
 * @param searchTerm - Arama terimi
 * @returns Regex pattern
 */
const createTurkishRegexPattern = (searchTerm: string): string => {
  return searchTerm
    .toLowerCase()
    .split('')
    .map(char => {
      // Her karakter için tüm alternatiflerini al
      const turkishAlternatives = getTurkishAlternatives(char);
      if (turkishAlternatives.length > 1) {
        return `[${turkishAlternatives.join('')}]`;
      }
      
      // Özel karakterleri escape et
      return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('');
};

// Bir karakter için tüm Türkçe alternatiflerini getir
const getTurkishAlternatives = (char: string): string[] => {
  const charLower = char.toLowerCase();
  const charUpper = char.toUpperCase();
  
  // Temel karakter setini oluştur
  let alternatives = [charLower, charUpper];
  
  // Türkçe karakter eşleştirmeleri
  switch (charLower) {
    case 'c': alternatives = ['c', 'C', 'ç', 'Ç']; break;
    case 'ç': alternatives = ['ç', 'Ç', 'c', 'C']; break;
    case 'g': alternatives = ['g', 'G', 'ğ', 'Ğ']; break;
    case 'ğ': alternatives = ['ğ', 'Ğ', 'g', 'G']; break;
    case 'i': alternatives = ['i', 'I', 'ı', 'İ']; break;
    case 'ı': alternatives = ['ı', 'I', 'i', 'İ']; break;
    case 'İ': alternatives = ['İ', 'I', 'i', 'ı']; break;
    case 'o': alternatives = ['o', 'O', 'ö', 'Ö']; break;
    case 'ö': alternatives = ['ö', 'Ö', 'o', 'O']; break;
    case 's': alternatives = ['s', 'S', 'ş', 'Ş']; break;
    case 'ş': alternatives = ['ş', 'Ş', 's', 'S']; break;
    case 'u': alternatives = ['u', 'U', 'ü', 'Ü']; break;
    case 'ü': alternatives = ['ü', 'Ü', 'u', 'U']; break;
    default: alternatives = [charLower, charUpper]; break;
  }
  
  return [...new Set(alternatives)]; // Duplicate'ları kaldır
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
    // Büyük/küçük harf testleri
    { search: 'istanbul', target: 'İstanbul', expected: true },
    { search: 'İstanbul', target: 'istanbul', expected: true },
    { search: 'ISTANBUL', target: 'İstanbul', expected: true },
    { search: 'İSTANBUL', target: 'istanbul', expected: true },
    
    // Kısmi eşleşme testleri (SORUN OLAN KISIM)
    { search: 'İs', target: 'İstanbul, Türkiye', expected: true },
    { search: 'is', target: 'İstanbul, Türkiye', expected: true },
    { search: 'IS', target: 'İstanbul, Türkiye', expected: true },
    { search: 'iz', target: 'İzmir, Türkiye', expected: true },
    { search: 'İz', target: 'İzmir, Türkiye', expected: true },
    { search: 'IZ', target: 'İzmir, Türkiye', expected: true },
    { search: 'zm', target: 'İzmir, Türkiye', expected: true },
    { search: 'mir', target: 'İzmir, Türkiye', expected: true },
    
    // Türkçe karakter testleri
    { search: 'ankara', target: 'Ankara', expected: true },
    { search: 'ANKARA', target: 'ankara', expected: true },
    { search: 'izmir', target: 'İzmir', expected: true },
    { search: 'İZMİR', target: 'izmir', expected: true },
    { search: 'çankaya', target: 'Cankaya', expected: true },
    { search: 'ÇANKAYA', target: 'cankaya', expected: true },
    { search: 'cankaya', target: 'Çankaya', expected: true },
    { search: 'CANKAYA', target: 'çankaya', expected: true },
    { search: 'göztepe', target: 'Goztepe', expected: true },
    { search: 'GÖZTEPE', target: 'goztepe', expected: true },
    { search: 'şişli', target: 'Sisli', expected: true },
    { search: 'ŞİŞLİ', target: 'sisli', expected: true },
    
    // Hastane isimleri testleri
    { search: 'acı', target: 'Acıbadem Hastanesi', expected: true },
    { search: 'ACI', target: 'Acıbadem Hastanesi', expected: true },
    { search: 'acibadem', target: 'Acıbadem Hastanesi', expected: true },
    { search: 'ACİBADEM', target: 'Acıbadem Hastanesi', expected: true },
    { search: 'mem', target: 'Memorial Hastanesi', expected: true },
    { search: 'MEM', target: 'memorial hastanesi', expected: true },
    { search: 'memorial', target: 'Memorial Hastanesi', expected: true },
    { search: 'MEMORİAL', target: 'Memorial Hastanesi', expected: true },
  ];
  
  testCases.forEach(({ search, target, expected }) => {
    const result = turkishSearch(search, target);
    console.log(`${result === expected ? '✅' : '❌'} "${search}" -> "${target}": ${result}`);
  });
}; 