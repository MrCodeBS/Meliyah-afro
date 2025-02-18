interface CacheOptions {
  maxAge?: number;
  maxSize?: number;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

// LRU Cache implementation
class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize = 100, maxAge = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to front (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Create singleton cache instance
const globalCache = new LRUCache();

export function memoize<T>(
  fn: (...args: any[]) => Promise<T>,
  options: CacheOptions = {}
) {
  const {
    maxAge = 5 * 60 * 1000, // 5 minutes
    maxSize = 100
  } = options;

  return async (...args: any[]): Promise<T> => {
    const key = JSON.stringify(args);
    const cached = globalCache.get(key);

    if (cached) return cached;

    const result = await fn(...args);
    globalCache.set(key, result);
    return result;
  };
}