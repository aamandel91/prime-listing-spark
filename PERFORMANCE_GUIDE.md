# Performance Optimization Guide

## 🎯 Core Web Vitals Targets

Our goal is to achieve **100% Core Web Vitals scores** on both mobile and desktop:

- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **INP (Interaction to Next Paint)**: ≤ 200ms (replaces FID)
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **FCP (First Contentful Paint)**: ≤ 1.8s
- **TTFB (Time to First Byte)**: ≤ 800ms

## ✅ What We've Implemented

### 1. **Code Splitting & Lazy Loading**
- All CMS modules lazy load on-demand
- Heavy dependencies (react-quill, Google Maps) split into separate chunks
- Admin components never load for regular users

### 2. **Optimized Image Loading**
- Native lazy loading with `loading="lazy"`
- Responsive images with srcset
- Proper aspect ratios to prevent CLS
- Fallback images for error states

### 3. **Smart Bundle Splitting**
- Vendor chunks for better caching
- Feature-based module chunks
- Admin code isolated from user code

### 4. **Performance Monitoring**
- Web Vitals tracking built-in
- Performance budgets enforced
- Component render time measurement

## 📋 Checklist for New Modules

When creating new CMS modules, ensure:

### ✅ Code Structure
- [ ] Module is lazy loaded in `ModuleRenderer.tsx`
- [ ] Suspense boundary with loading skeleton
- [ ] No heavy dependencies imported at top level

### ✅ Images & Media
- [ ] All images use `OptimizedImage` component
- [ ] `width` and `height` attributes set (prevents CLS)
- [ ] `loading="lazy"` for below-fold images
- [ ] `priority={true}` only for above-fold images

### ✅ Data Fetching
- [ ] Use React Query for caching
- [ ] Show loading states immediately
- [ ] Implement error boundaries
- [ ] Prefetch critical data

### ✅ Layout Shifts
- [ ] Reserve space for dynamic content
- [ ] Use skeleton loaders with correct dimensions
- [ ] Avoid layout changes after load
- [ ] Set explicit dimensions on all media

### ✅ Third-Party Scripts
- [ ] Load scripts with `defer` or `async`
- [ ] Use `<Script strategy="lazyOnload">` for non-critical scripts
- [ ] Consider using facades for embeds (YouTube, Maps)

## 🚫 Performance Anti-Patterns to Avoid

### ❌ Don't Do This
```tsx
// Importing heavy dependencies directly
import ReactQuill from 'react-quill';
import { GoogleMap } from '@react-google-maps/api';

// Large inline data in components
const HUGE_DATA_ARRAY = [ /* 10000 items */ ];

// No loading states
const MyComponent = () => {
  const [data, setData] = useState([]);
  // Component blank until data loads (bad UX + CLS)
}

// Images without dimensions
<img src={url} alt="..." /> // Causes layout shift!
```

### ✅ Do This Instead
```tsx
// Lazy load heavy components
const RichEditor = lazy(() => import('./RichEditor'));

// Move large data to separate files
import { LARGE_DATA } from './data/constants';

// Always show loading states
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  if (loading) return <Skeleton />;
  return <div>{data}</div>;
}

// Images with explicit dimensions
<OptimizedImage 
  src={url} 
  alt="..." 
  width={800} 
  height={600}
  loading="lazy"
/>
```

## 🔧 Testing Performance

### Local Testing
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run Lighthouse
npx lighthouse http://localhost:4173 --view
```

### Performance Budgets
Monitor bundle sizes:
```bash
# Analyze bundle
npm run build -- --mode analyze
```

Budgets enforced:
- Initial JS bundle: < 200KB gzipped
- CSS bundle: < 50KB gzipped  
- Per-route chunks: < 100KB gzipped
- Images: WebP/AVIF, < 200KB each

## 📊 Monitoring in Production

### Web Vitals Tracking
```typescript
import { reportWebVitals } from './utils/performanceMonitoring';

reportWebVitals((metric) => {
  // Send to your analytics
  gtag('event', metric.name, {
    value: metric.value,
    metric_id: metric.id,
    metric_delta: metric.delta,
  });
});
```

### Setup Real User Monitoring (RUM)
1. Add Google Analytics 4 or similar
2. Track Core Web Vitals events
3. Monitor by page type (city pages, property pages, etc.)
4. Set up alerts for budget violations

## 🎨 Module Development Guidelines

### Creating a New CMS Module

1. **Create the module component:**
```tsx
// src/components/cms/modules/MyNewModuleRenderer.tsx
import { lazy, Suspense } from 'react';
import OptimizedImage from '@/components/OptimizedImage';

export function MyNewModuleRenderer({ module }) {
  return (
    <div className="my-module">
      <OptimizedImage
        src={module.imageUrl}
        alt={module.altText}
        width={1200}
        height={600}
        loading="lazy"
      />
      {/* Module content */}
    </div>
  );
}
```

2. **Add lazy loading in ModuleRenderer:**
```tsx
const MyNewModuleRenderer = lazy(() => 
  import('./modules/MyNewModuleRenderer')
    .then(m => ({ default: m.MyNewModuleRenderer }))
);

// In switch statement:
case "my_new_module":
  return <MyNewModuleRenderer module={module} />;
```

3. **Test performance:**
```bash
# Check bundle size impact
npm run build
# Verify lazy loading works
npm run preview
```

## 🔍 Common Performance Issues & Fixes

### Issue: High LCP
**Causes:**
- Large images above fold
- Render-blocking resources
- Slow server response

**Fixes:**
- Use `priority={true}` for hero images
- Preload critical resources
- Optimize server/database queries

### Issue: High CLS
**Causes:**
- Images without dimensions
- Dynamic content insertion
- Web fonts loading

**Fixes:**
- Always set width/height on images
- Reserve space with skeletons
- Use `font-display: swap`

### Issue: Large JavaScript Bundle
**Causes:**
- Heavy dependencies
- No code splitting
- Duplicate code

**Fixes:**
- Audit with bundle analyzer
- Lazy load non-critical code
- Remove unused dependencies

## 📈 Performance Metrics Dashboard

Monitor these in your analytics:

### Mobile Metrics
- LCP: Target < 2.5s
- INP: Target < 200ms
- CLS: Target < 0.1

### Desktop Metrics  
- LCP: Target < 2.0s
- INP: Target < 100ms
- CLS: Target < 0.05

### Per-Page Budgets
- Homepage: < 1.5s LCP
- City pages: < 2.0s LCP
- Property pages: < 2.5s LCP
- Blog posts: < 2.0s LCP

## 🚀 Deployment Checklist

Before deploying new features:

- [ ] Run Lighthouse audit (aim for 95+ score)
- [ ] Check bundle size hasn't increased significantly
- [ ] Test on slow 3G network
- [ ] Verify lazy loading works
- [ ] Check for console errors
- [ ] Test on mobile devices
- [ ] Verify images load properly
- [ ] Check for layout shifts

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)