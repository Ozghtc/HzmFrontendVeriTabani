export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

export const validateExpiryDate = (expiryDate: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
  
  const [month, year] = expiryDate.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string): boolean => {
  return /^\d{3}$/.test(cvv);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}; 