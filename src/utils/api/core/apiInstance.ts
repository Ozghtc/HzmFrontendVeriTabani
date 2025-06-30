import { ApiClient } from './ApiClient';
import { API_CONFIG } from '../config/apiConfig';

// Create singleton instance
export const apiClient = new ApiClient(API_CONFIG.baseURL);

// Initialize on import
apiClient.initialize().catch(error => {
  console.error('Failed to initialize API client:', error);
});

// Make apiClient available globally for debugging in production
if (typeof window !== 'undefined') {
  (window as any).apiClient = apiClient;
}

// Export for direct use
export default apiClient; 