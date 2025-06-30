import { RequestConfig, RetryConfig } from '../types/apiTypes';
import { API_CONFIG } from '../config/apiConfig';

// Enhanced fetch with timeout
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = API_CONFIG.timeout
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your internet connection');
    }
    throw error;
  }
};

// Calculate delay for retry
const calculateDelay = (attempt: number, config: RetryConfig): number => {
  const baseDelay = config.delay || 1000;
  
  if (config.backoff === 'exponential') {
    return baseDelay * Math.pow(2, attempt);
  }
  
  return baseDelay * (attempt + 1);
};

// Should retry based on error
const shouldRetry = (error: any, attempt: number, config: RetryConfig): boolean => {
  const maxRetries = config.maxRetries || API_CONFIG.retryDefaults.maxRetries;
  
  if (attempt >= maxRetries) {
    return false;
  }
  
  // Don't retry on client errors (4xx)
  if (error.status && error.status >= 400 && error.status < 500) {
    return false;
  }
  
  // Retry on network errors or server errors (5xx)
  return true;
};

// Retry mechanism
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  retryConfig?: RetryConfig
): Promise<T> => {
  const config = { ...API_CONFIG.retryDefaults, ...retryConfig };
  let lastError: any;
  
  for (let attempt = 0; attempt <= (config.maxRetries || 3); attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      
      if (!shouldRetry(error, attempt, config)) {
        throw error;
      }
      
      if (attempt < (config.maxRetries || 3)) {
        const delay = calculateDelay(attempt, config);
        console.log(`Request failed, retrying... (${attempt + 1}/${config.maxRetries}) after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}; 