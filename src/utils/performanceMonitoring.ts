/**
 * Performance Monitoring Utilities
 * Tracks Core Web Vitals and provides performance budgets
 */

export interface PerformanceBudget {
  lcp: number; // Largest Contentful Paint (ms)
  inp: number; // Interaction to Next Paint (ms) - replaces FID
  cls: number; // Cumulative Layout Shift (score)
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
}

// Target budgets for 100% Core Web Vitals score
export const PERFORMANCE_BUDGET: PerformanceBudget = {
  lcp: 2500,  // Good: <= 2.5s
  inp: 200,   // Good: <= 200ms (replaces FID)
  cls: 0.1,   // Good: <= 0.1
  fcp: 1800,  // Good: <= 1.8s
  ttfb: 800,  // Good: <= 800ms
};

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export const logPerformanceMetrics = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.group('🚀 Performance Metrics');
    console.log('TTFB:', navigation.responseStart - navigation.requestStart, 'ms');
    console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
    console.log('Load Complete:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
    console.groupEnd();
  }
};

// Check if performance budget is exceeded
export const checkPerformanceBudget = (metric: string, value: number): boolean => {
  const budget = PERFORMANCE_BUDGET[metric as keyof PerformanceBudget];
  if (budget && value > budget) {
    console.warn(`⚠️ Performance budget exceeded for ${metric}: ${value} > ${budget}`);
    return false;
  }
  return true;
};

// Lazy load modules that are not immediately visible
export const useLazyLoadModules = () => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const module = entry.target as HTMLElement;
            const moduleType = module.dataset.moduleType;
            
            // Track when modules become visible
            console.log(`📦 Module loaded: ${moduleType}`);
            observer.unobserve(module);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before visible
      }
    );

    return observer;
  }
  return null;
};

// Prefetch critical resources
export const prefetchCriticalResources = (resources: string[]) => {
  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Measure component render time
export const measureRenderTime = (componentName: string, renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  
  const renderTime = end - start;
  if (renderTime > 16) { // More than one frame (60fps)
    console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
  }
};