import { monitoring } from './monitoring';

// Web Vitals configuration
const VITALS_CONFIG = {
  THRESHOLD_FCP: 2500, // First Contentful Paint threshold (ms)
  THRESHOLD_LCP: 4000, // Largest Contentful Paint threshold (ms)
  THRESHOLD_FID: 100,  // First Input Delay threshold (ms)
  THRESHOLD_CLS: 0.1,  // Cumulative Layout Shift threshold
  SAMPLE_RATE: 0.1     // Sample 10% of users
};

// Track Core Web Vitals
export function trackWebVitals() {
  if (Math.random() > VITALS_CONFIG.SAMPLE_RATE) return;

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const metric = {
          name: entry.name,
          value: entry.value,
          rating: getRating(entry),
          timestamp: new Date().toISOString()
        };

        monitoring.trackEvent('web_vital', metric);

        // Alert on poor performance
        if (metric.rating === 'poor') {
          monitoring.trackError(new Error(`Poor Web Vital: ${metric.name}`), metric);
        }
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (error) {
    console.error('Failed to track web vitals:', error);
  }
}

// Get performance rating
function getRating(entry: PerformanceEntry): 'good' | 'needs-improvement' | 'poor' {
  const value = entry.value;
  
  switch (entry.name) {
    case 'FCP':
      return value <= VITALS_CONFIG.THRESHOLD_FCP ? 'good' : value <= VITALS_CONFIG.THRESHOLD_FCP * 2 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= VITALS_CONFIG.THRESHOLD_LCP ? 'good' : value <= VITALS_CONFIG.THRESHOLD_LCP * 2 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= VITALS_CONFIG.THRESHOLD_FID ? 'good' : value <= VITALS_CONFIG.THRESHOLD_FID * 2 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= VITALS_CONFIG.THRESHOLD_CLS ? 'good' : value <= VITALS_CONFIG.THRESHOLD_CLS * 2 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}