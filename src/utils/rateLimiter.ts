interface RateLimitResponse {
  allowed: boolean;
  remaining?: number;
  retryAfter?: number;
  error?: string;
}

const API_BASE = 'https://your-backend-url.com';

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
): Promise<RateLimitResponse> {
  try {
    const response = await fetch(`${API_BASE}/rate-limiter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        max_requests: maxRequests,
        window_seconds: windowSeconds,
      }),
    });

    if (response.status === 429) {
      const data = await response.json();
      return {
        allowed: false,
        retryAfter: data.retry_after,
        error: data.error,
      };
    }

    const data = await response.json();
    return {
      allowed: true,
      remaining: data.remaining,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true };
  }
}

export function createRateLimitedFetch() {
  return async function rateLimitedFetch(
    url: string,
    options: RequestInit = {},
    identifier: string
  ): Promise<Response> {
    const limitCheck = await checkRateLimit(identifier);

    if (!limitCheck.allowed) {
      throw new Error(
        `Rate limit exceeded. Retry after ${limitCheck.retryAfter} seconds.`
      );
    }

    return fetch(url, options);
  };
}
