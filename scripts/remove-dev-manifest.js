#!/usr/bin/env node

/**
 * Development Manifest Check Script
 * 
 * This script ensures the development manifest is properly configured
 * and removes any production-specific manifest links.
 */

import fs from 'fs/promises';
import path from 'path';

async function removeDevManifest() {
  try {
    // Check if development manifest exists
    const devManifestPath = path.resolve('public/manifest.webmanifest');
    try {
      await fs.access(devManifestPath);
      console.log('✅ Development manifest exists');
    } catch {
      console.log('⚠️  Development manifest not found - creating minimal version');
      const minimalManifest = {
        name: "Property Cleaning Scheduler (Dev)",
        short_name: "CleanSync Dev",
        description: "Development version - PWA features disabled",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1976d2"
      };
      await fs.writeFile(devManifestPath, JSON.stringify(minimalManifest, null, 2));
    }
    
    // In production mode, remove development manifest link from HTML
    if (process.env.NODE_ENV === 'production') {
      const htmlPath = path.resolve('dist/index.html');
      try {
        let htmlContent = await fs.readFile(htmlPath, 'utf8');
        
        // Remove development manifest link (the one with crossorigin)
        const devManifestRegex = /<link[^>]*rel=["']manifest["'][^>]*crossorigin[^>]*>/gi;
        const originalContent = htmlContent;
        htmlContent = htmlContent.replace(devManifestRegex, '');
        
        if (htmlContent !== originalContent) {
          await fs.writeFile(htmlPath, htmlContent, 'utf8');
          console.log('✅ Removed development manifest link from production build');
        }
      } catch (error) {
        console.log('⚠️  Could not update production HTML:', error.message);
      }
    }
    
    console.log('✅ Development manifest check completed');
    
  } catch (error) {
    console.error('❌ Error in development manifest check:', error.message);
    // Don't exit with error in development
  }
}

// Run the removal
removeDevManifest(); 