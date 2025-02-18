import { logger } from './logger';

// Enhanced monitoring configuration
const MONITORING_CONFIG = {
  SAMPLE_RATE: 0.1, // Sample 10% of requests
  ERROR_THRESHOLD: 50, // Alert after 50 errors
  PERFORMANCE_THRESHOLD: 1000, // Alert on requests over 1s
};

// Error counter for alerting
const errorCounts = new Map<string, number>();

export const monitoring = {
  trackError: (error: Error, context?: Record<string, any>) => {
    const errorKey = `${error.name}:${error.message}`;
    const count = (errorCounts.get(errorKey) || 0) + 1;
    errorCounts.set(errorKey, count);

    // Alert on error threshold exceeded
    if (count === MONITORING_CONFIG.ERROR_THRESHOLD) {
      logger.error(`Error threshold exceeded for: ${errorKey}`, {
        context: { count }
      });
    }

    logger.error(error.message, { 
      context: {
        ...context,
        errorName: error.name,
        stack: error.stack,
        count
      }
    });
  },

  trackEvent: (name: string, properties?: Record<string, any>) => {
    // Sample events based on configuration
    if (Math.random() < MONITORING_CONFIG.SAMPLE_RATE) {
      logger.info(`Event: ${name}`, { 
        context: {
          ...properties,
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  trackApiCall: async <T>(
    name: string,
    fn: () => Promise<T>,
    options: { timeout?: number } = {}
  ): Promise<T> => {
    const start = Date.now();

    try {
      // Add timeout if specified
      const timeoutPromise = options.timeout
        ? new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API Timeout')), options.timeout)
          )
        : null;

      const result = await (timeoutPromise
        ? Promise.race([fn(), timeoutPromise])
        : fn()) as T;

      const duration = Date.now() - start;

      // Alert on slow requests
      if (duration > MONITORING_CONFIG.PERFORMANCE_THRESHOLD) {
        logger.warn(`Slow API call: ${name}`, {
          context: { duration: `${duration}ms` }
        });
      }

      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        logger.info(`API Call: ${name}`, {
          context: {
            duration: `${duration}ms`,
            success: true
          }
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`API Error: ${name}`, {
        context: {
          duration: `${duration}ms`,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
};