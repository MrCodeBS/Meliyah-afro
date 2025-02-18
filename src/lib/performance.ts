// Cross-platform performance measurement
const getPerformanceNow = () => {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
};

// Cross-platform memory usage
const getMemoryUsage = () => {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed;
  }
  return 0;
};

export const performance = {
  measure: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const startTime = getPerformanceNow();
    const startMemory = getMemoryUsage();
    
    try {
      const result = await fn();
      const endTime = getPerformanceNow();
      const endMemory = getMemoryUsage();
      
      const duration = endTime - startTime;
      const memoryDiff = endMemory - startMemory;

      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance [${name}]:`, {
          duration: `${duration.toFixed(2)}ms`,
          memoryUsed: memoryDiff > 0 ? `${(memoryDiff / 1024 / 1024).toFixed(2)}MB` : 'N/A'
        });
      }
      
      return result;
    } catch (error) {
      const endTime = getPerformanceNow();
      console.error(`Performance Error [${name}]:`, {
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Optimized debounce with TypeScript improvements
  debounce: <T extends (...args: any[]) => any>(
    fn: T,
    wait: number,
    options: { leading?: boolean; maxWait?: number } = {}
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (options.leading && !timeout) {
        fn(...args);
        lastCall = now;
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        if (options.maxWait && now - lastCall >= options.maxWait) {
          fn(...args);
          lastCall = now;
        } else if (!options.leading) {
          fn(...args);
        }
        timeout = null;
      }, wait);
    };
  },

  // Enhanced throttle with better timing control
  throttle: <T extends (...args: any[]) => any>(
    fn: T,
    limit: number,
    options: { trailing?: boolean } = {}
  ): ((...args: Parameters<T>) => void) => {
    let lastRun = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
      const now = Date.now();

      if (lastRun && now < lastRun + limit) {
        if (options.trailing && !timeout) {
          timeout = setTimeout(() => {
            fn(...args);
            lastRun = now;
            timeout = null;
          }, limit);
        }
        return;
      }

      fn(...args);
      lastRun = now;
    };
  }
};