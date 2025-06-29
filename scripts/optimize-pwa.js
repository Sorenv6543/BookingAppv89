#!/usr/bin/env node

/**
 * PWA Optimization Script for Property Cleaning Scheduler
 * Analyzes and optimizes PWA performance for role-based architecture
 */

import { promises as fs } from 'fs'
import path from 'path'

async function analyzeBuildSize() {
  const distPath = path.resolve('dist')
  
  try {
    const files = await fs.readdir(distPath, { recursive: true })
    const assetSizes = {}
    
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const filePath = path.join(distPath, file)
        const stats = await fs.stat(filePath)
        assetSizes[file] = stats.size
      }
    }
    
    console.log('PWA Bundle Analysis:')
    console.log('====================')
    
    // Sort by size
    const sortedAssets = Object.entries(assetSizes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
    
    sortedAssets.forEach(([file, size]) => {
      const sizeKB = (size / 1024).toFixed(2)
      console.log(`${file}: ${sizeKB} KB`)
    })
    
    // Check for role-based chunks
    const roleChunks = sortedAssets.filter(([file]) => 
      file.includes('admin') || file.includes('owner') || file.includes('shared')
    )
    
    console.log('\nRole-Based Chunks:')
    console.log('==================')
    roleChunks.forEach(([file, size]) => {
      const sizeKB = (size / 1024).toFixed(2)
      console.log(`${file}: ${sizeKB} KB`)
    })
    
  } catch (error) {
    console.error('Error analyzing build:', error)
  }
}

async function checkPWAConfig() {
  try {
    const manifestPath = path.resolve('dist/manifest.webmanifest')
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
    
    console.log('\nPWA Manifest Check:')
    console.log('===================')
    console.log(`Name: ${manifest.name}`)
    console.log(`Short Name: ${manifest.short_name}`)
    console.log(`Icons: ${manifest.icons?.length || 0} defined`)
    console.log(`Display Mode: ${manifest.display}`)
    console.log(`Theme Color: ${manifest.theme_color}`)
    
    // Check required icons
    const requiredSizes = ['192x192', '512x512']
    const availableSizes = manifest.icons?.map(icon => icon.sizes) || []
    const missingSizes = requiredSizes.filter(size => !availableSizes.includes(size))
    
    if (missingSizes.length > 0) {
      console.log(`⚠️  Missing icon sizes: ${missingSizes.join(', ')}`)
    } else {
      console.log('✅ All required icon sizes present')
    }
    
  } catch (error) {
    console.error('Error checking PWA config:', error)
  }
}

async function analyzeServiceWorker() {
  try {
    const swPath = path.resolve('dist/sw.js')
    const swStats = await fs.stat(swPath)
    const swSizeKB = (swStats.size / 1024).toFixed(2)
    
    console.log('\nService Worker Analysis:')
    console.log('========================')
    console.log(`Service Worker Size: ${swSizeKB} KB`)
    
    // Check for role-based caching
    const swContent = await fs.readFile(swPath, 'utf8')
    const hasRoleCaching = swContent.includes('role-based-chunks')
    const hasAPICaching = swContent.includes('api-cache')
    
    console.log(`Role-based caching: ${hasRoleCaching ? '✅ Enabled' : '❌ Missing'}`)
    console.log(`API caching: ${hasAPICaching ? '✅ Enabled' : '❌ Missing'}`)
    
  } catch (error) {
    console.error('Error analyzing service worker:', error)
  }
}

// Run analysis
console.log('🔍 Analyzing PWA Build...\n')
analyzeBuildSize()
  .then(() => checkPWAConfig())
  .then(() => analyzeServiceWorker())
  .then(() => console.log('\n✅ PWA Analysis Complete!'))
  .catch(error => console.error('Analysis failed:', error)) 