import { RateLimitInfo } from '../types/apiTypes';
import { API_CONFIG } from '../config/apiConfig';

interface QueuedRequest {
  execute: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export class RateLimiter {
  private requestCounts: Map<string, number[]> = new Map();
  private queue: QueuedRequest[] = [];
  private processing = false;
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor(
    private maxRequestsPerMinute = API_CONFIG.rateLimiting.maxRequestsPerMinute,
    private maxBurst = API_CONFIG.rateLimiting.maxBurst
  ) {}

  // Update rate limit info from response headers
  updateFromHeaders(headers: Headers): void {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    const retryAfter = headers.get('Retry-After');

    if (limit && remaining && reset) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
      };
    }
  }

  // Check if request can proceed
  private canProceed(key: string = 'default'): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    // Get requests in current window
    const requests = this.requestCounts.get(key) || [];
    const recentRequests = requests.filter(time => time > windowStart);

    // Update the map with filtered requests
    this.requestCounts.set(key, recentRequests);

    // Check rate limit from server
    if (this.rateLimitInfo && this.rateLimitInfo.remaining <= 0) {
      return false;
    }

    // Check local rate limit
    return recentRequests.length < this.maxRequestsPerMinute;
  }

  // Execute request with rate limiting
  async execute<T>(
    requestFn: () => Promise<T>,
    key: string = 'default'
  ): Promise<T> {
    if (!API_CONFIG.rateLimiting.enabled) {
      return requestFn();
    }

    return new Promise((resolve, reject) => {
      const queuedRequest: QueuedRequest = {
        execute: requestFn,
        resolve,
        reject,
      };

      this.queue.push(queuedRequest);
      this.processQueue(key);
    });
  }

  // Process queued requests
  private async processQueue(key: string): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      if (!this.canProceed(key)) {
        // Wait before retrying
        const waitTime = this.getWaitTime();
        console.log(`Rate limit reached, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const request = this.queue.shift();
      if (!request) continue;

      // Record request time
      const requests = this.requestCounts.get(key) || [];
      requests.push(Date.now());
      this.requestCounts.set(key, requests);

      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }

    this.processing = false;
  }

  // Calculate wait time based on rate limit info
  private getWaitTime(): number {
    if (this.rateLimitInfo?.retryAfter) {
      return this.rateLimitInfo.retryAfter * 1000;
    }

    if (this.rateLimitInfo?.reset) {
      const resetTime = this.rateLimitInfo.reset * 1000;
      const waitTime = resetTime - Date.now();
      return Math.max(waitTime, 1000);
    }

    // Default wait time
    return 60000 / this.maxRequestsPerMinute;
  }

  // Get current rate limit info
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  // Clear all tracked requests
  clear(): void {
    this.requestCounts.clear();
    this.queue = [];
    this.rateLimitInfo = null;
  }
} 