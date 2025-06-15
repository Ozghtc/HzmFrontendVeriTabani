// Config
export * from './config';

// Project API
export * from './projectApi';

// Table API
export * from './tableApi';

// Data API
export * from './dataApi';

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}; 