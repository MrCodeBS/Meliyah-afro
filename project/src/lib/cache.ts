import { LRUCache } from 'lru-cache';

// Enhanced caching configuration
const CACHE_CONFIG = {
  MAX_SIZE: 1000,
  TTL: 5 * 60 * 1000, // 5 minutes
  UPDATE_AGE_ON_GET: true,
  ALLOW_STALE: true,
  STALE_WHILE_REVALIDATE: 60 * 1000 // 1 minute
};

// Create type-safe cache instances
export function createCache<T>(options: Partial<typeof CACHE_CONFIG> = {}) {
  return new LRUCache<string, T>({
    max: options.MAX_SIZE || CACHE_CONFIG.MAX_SIZE,
    ttl: options.TTL || CACHE_CONFIG.TTL,
    updateAgeOnGet: CACHE_CONFIG.UPDATE_AGE_ON_GET,
    allowStale: CACHE_CONFIG.ALLOW_STALE,
    fetchMethod: async (key, staleValue, { signal }) => {
      // Implement stale-while-revalidate
      if (staleValue && Date.now() - staleValue.timestamp < CACHE_CONFIG.STALE_WHILE_REVALIDATE) {
        return staleValue;
      }
      return null;
    }
  });
}

// Create shared cache instances
export const pageCache = createCache<string>();
export const apiCache = createCache<any>();
export const imageCache = createCache<Blob>();