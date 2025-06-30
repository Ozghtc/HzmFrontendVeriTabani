export const handleCopyApiKey = (apiKey: string): void => {
  navigator.clipboard.writeText(apiKey);
  alert('API Key kopyalandı!');
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR');
};

export const maskApiKey = (apiKey: string): string => {
  return '•'.repeat(20) + apiKey.slice(-8);
};
