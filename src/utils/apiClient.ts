/**
 * Resilient API Client with Exponential Backoff, Jitter, Timeout, and Fallbacks.
 * Prevents UI crashes when backend/network errors occur.
 */

import { errorTracker } from './errorTracker';

export interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  retryOnStatusCodes?: number[];
  onRetry?: (attempt: number, error: Error, delayMs: number) => void;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  isFallback?: boolean;
  statusCode?: number;
  durationMs?: number;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelayMs: 600,
  maxDelayMs: 6000,
  timeoutMs: 25000,
  retryOnStatusCodes: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

/**
 * Calculate Exponential Backoff with Full Jitter:
 * delay = rand(0, min(maxDelay, baseDelay * 2^attempt))
 */
export function calculateBackoffWithJitter(
  attempt: number,
  baseDelayMs = 600,
  maxDelayMs = 6000
): number {
  const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
  // Full Jitter to avoid synchronized thundering herds
  return Math.floor(Math.random() * (exponentialDelay - baseDelayMs / 2) + baseDelayMs / 2);
}

/**
 * Robust fetcher with Auto-Retry, Timeout, Jitter, and Fallback protection.
 */
export async function fetchWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  customConfig?: RetryConfig,
  fallbackData?: T
): Promise<ApiResponse<T>> {
  const config: Required<RetryConfig> = {
    ...DEFAULT_RETRY_CONFIG,
    ...customConfig,
  };

  const startTime = Date.now();
  let lastError: Error | null = null;
  let lastStatusCode = 0;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      errorTracker.addBreadcrumb({
        category: 'network',
        message: `API Request: ${options.method || 'GET'} ${url} (Attempt ${attempt + 1}/${config.maxRetries + 1})`,
        level: 'info',
      });

      const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      if (!isFormData && !headers['Content-Type'] && options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
      }

      if (!headers['x-custom-api-keys'] && typeof window !== 'undefined') {
        try {
          const customKeys = localStorage.getItem('custom_api_keys');
          if (customKeys) {
            headers['x-custom-api-keys'] = encodeURIComponent(customKeys);
          }
        } catch (e) {}
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);
      lastStatusCode = response.status;

      // Handle successful HTTP responses (200-299)
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let data: T;

        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = (await response.text()) as unknown as T;
        }

        const durationMs = Date.now() - startTime;
        return {
          success: true,
          data,
          statusCode: response.status,
          durationMs,
          isFallback: false,
        };
      }

      // Check if status code is eligible for retry
      const isRetryableStatus = config.retryOnStatusCodes.includes(response.status);
      if (!isRetryableStatus || attempt === config.maxRetries) {
        let errMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errBody = await response.json();
          if (errBody.error || errBody.message) {
            errMessage = errBody.error || errBody.message;
          }
        } catch {
          // Ignore JSON parse error on error responses
        }

        throw new Error(errMessage);
      }

      // Retryable HTTP status (429, 502, 503, 504, etc.)
      const retryAfterHeader = response.headers.get('Retry-After');
      let jitterDelay = calculateBackoffWithJitter(attempt, config.baseDelayMs, config.maxDelayMs);
      if (retryAfterHeader && !isNaN(Number(retryAfterHeader))) {
        jitterDelay = Number(retryAfterHeader) * 1000;
      }

      config.onRetry(attempt + 1, new Error(`HTTP ${response.status}`), jitterDelay);
      await new Promise((resolve) => setTimeout(resolve, jitterDelay));

    } catch (err: any) {
      clearTimeout(timeoutId);
      lastError = err?.name === 'AbortError' 
        ? new Error(`Permintaan waktu habis (${config.timeoutMs / 1000}s timeout) ke ${url}`)
        : (err instanceof Error ? err : new Error(String(err)));

      const isLastAttempt = attempt === config.maxRetries;
      if (isLastAttempt) {
        break;
      }

      const jitterDelay = calculateBackoffWithJitter(attempt, config.baseDelayMs, config.maxDelayMs);
      config.onRetry(attempt + 1, lastError, jitterDelay);
      await new Promise((resolve) => setTimeout(resolve, jitterDelay));
    }
  }

  // If all attempts fail, log telemetry and return fallback or formatted error response
  const finalErrorMsg = lastError?.message || 'Gagal menghubungi server API';
  if (fallbackData === undefined) {
    errorTracker.captureException(lastError || new Error(finalErrorMsg), {
      url,
      statusCode: lastStatusCode,
      durationMs: Date.now() - startTime,
      fallbackUsed: false,
    });
  } else {
    errorTracker.addBreadcrumb({
      category: 'network',
      message: `Fallback digunakan untuk ${url} (${finalErrorMsg})`,
      level: 'warn',
    });
  }

  return {
    success: fallbackData !== undefined,
    data: (fallbackData !== undefined ? fallbackData : null) as T,
    error: finalErrorMsg,
    isFallback: fallbackData !== undefined,
    statusCode: lastStatusCode,
    durationMs: Date.now() - startTime,
  };
}

/**
 * Convenient shorthand helper with safe default fallback.
 */
export async function safeApiCall<T>(
  apiFn: () => Promise<T>,
  fallbackValue: T,
  contextName = 'ApiCall'
): Promise<T> {
  try {
    return await apiFn();
  } catch (err: any) {
    console.warn(`[SafeApiCall] ${contextName} failed, using fallback:`, err?.message || err);
    errorTracker.captureMessage(`Fallback used in ${contextName}: ${err?.message || err}`, 'warn');
    return fallbackValue;
  }
}
