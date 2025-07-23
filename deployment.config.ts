/**
 * Deployment Configuration for Role-Based Booking System
 * 
 * This file defines deployment modes and optimizations for different
 * environments and role-based feature sets.
 */

export interface DeploymentConfig {
  name: string
  description: string
  features: {
    ownerFeatures: boolean
    adminFeatures: boolean
    devDemos: boolean
  }
  build: {
    minify: boolean
    sourcemap: boolean | 'hidden'
    optimization: 'development' | 'production' | 'aggressive'
  }
  chunks: {
    ownerComponents: boolean
    adminComponents: boolean
    sharedComponents: boolean
  }
}

export const deploymentConfigs: Record<string, DeploymentConfig> = {
  // Full production build with all features
  production: {
    name: 'Production (Full)',
    description: 'Complete multi-tenant system for property owners and admin',
    features: {
      ownerFeatures: true,
      adminFeatures: true,
      devDemos: false
    },
    build: {
      minify: true,
      sourcemap: 'hidden',
      optimization: 'aggressive'
    },
    chunks: {
      ownerComponents: true,
      adminComponents: true,
      sharedComponents: true
    }
  },

  // Owner-only build for property owner interfaces
  ownerOnly: {
    name: 'Owner Interface Only',
    description: 'Lightweight build for property owner users only',
    features: {
      ownerFeatures: true,
      adminFeatures: false,
      devDemos: false
    },
    build: {
      minify: true,
      sourcemap: 'hidden',
      optimization: 'aggressive'
    },
    chunks: {
      ownerComponents: true,
      adminComponents: false,
      sharedComponents: true
    }
  },

  // Admin-only build for business management
  adminOnly: {
    name: 'Admin Interface Only',
    description: 'Administrative interface for business management',
    features: {
      ownerFeatures: false,
      adminFeatures: true,
      devDemos: false
    },
    build: {
      minify: true,
      sourcemap: 'hidden',
      optimization: 'aggressive'
    },
    chunks: {
      ownerComponents: false,
      adminComponents: true,
      sharedComponents: true
    }
  },

  // Development build with all features and debugging
  development: {
    name: 'Development',
    description: 'Full-featured development build with demos and debugging',
    features: {
      ownerFeatures: true,
      adminFeatures: true,
      devDemos: true
    },
    build: {
      minify: false,
      sourcemap: true,
      optimization: 'development'
    },
    chunks: {
      ownerComponents: true,
      adminComponents: true,
      sharedComponents: true
    }
  },

  // Staging build for testing
  staging: {
    name: 'Staging',
    description: 'Production-like build for testing and QA',
    features: {
      ownerFeatures: true,
      adminFeatures: true,
      devDemos: true
    },
    build: {
      minify: true,
      sourcemap: true,
      optimization: 'production'
    },
    chunks: {
      ownerComponents: true,
      adminComponents: true,
      sharedComponents: true
    }
  }
}

/**
 * Get deployment configuration by name
 */
export function getDeploymentConfig(configName: string): DeploymentConfig {
  const config = deploymentConfigs[configName]
  if (!config) {
    throw new Error(`Unknown deployment configuration: ${configName}`)
  }
  return config
}

/**
 * Deployment optimization recommendations
 */
export const optimizationRecommendations = {
  production: [
    'Enable aggressive minification',
    'Use hidden sourcemaps for debugging',
    'Split role-based chunks for optimal loading',
    'Enable gzip/brotli compression',
    'Configure CDN for static assets'
  ],
  ownerOnly: [
    'Exclude admin components from bundle',
    'Optimize for mobile-first experience',
    'Minimize bundle size for faster loading',
    'Focus on owner workflow optimization'
  ],
  adminOnly: [
    'Exclude owner components from bundle',
    'Optimize for desktop/tablet experience',
    'Include comprehensive admin tools',
    'Focus on data management performance'
  ]
}

export default deploymentConfigs 