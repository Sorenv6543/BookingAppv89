/**
 * Lighthouse CI Configuration
 * 
 * Automated performance auditing for role-based property cleaning scheduler
 * Validates that performance achievements are maintained in production
 */

export default {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      startServerCommand: 'pnpm run preview',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 3
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        // Performance thresholds based on current achievements
        'categories:performance': ['error', { minScore: 0.85 }], // Maintain 85+ performance score
        'categories:accessibility': ['error', { minScore: 0.95 }], // High accessibility
        'categories:best-practices': ['error', { minScore: 0.90 }], // Best practices
        'categories:seo': ['error', { minScore: 0.90 }], // SEO compliance
        
        // Core Web Vitals - aligned with performance achievements
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }], // 2s FCP
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }], // 3s LCP
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // TBT < 300ms
        
        // Bundle size performance
        'unused-javascript': ['warn', { maxLength: 2 }], // Monitor unused JS
        'unminified-javascript': ['error', { maxLength: 0 }], // All JS should be minified
        'unused-css-rules': ['warn', { maxLength: 5 }], // Monitor unused CSS
        
        // Role-based performance monitoring
        'speed-index': ['error', { maxNumericValue: 4000 }], // 4s speed index
        'interactive': ['error', { maxNumericValue: 4000 }], // 4s time to interactive
        
        // PWA features (mobile optimization achievement)
        'installable-manifest': 'error',
        'service-worker': 'error',
        'works-offline': 'warn',
        
        // Resource optimization
        'uses-text-compression': 'error',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'modern-image-formats': 'warn'
      }
    }
  }
}