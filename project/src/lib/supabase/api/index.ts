export { bookingsApi } from './bookings';
export { packagesApi } from './packages';
export { productsApi } from './products';
export { servicesApi } from './services';
export { analyticsApi } from './analytics';
export { customersApi } from './customers';

// Production configuration
export const API_CONFIG = {
  BATCH_SIZE: 100,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
  CACHE_TIME: 5 * 60 * 1000 // 5 minutes
};