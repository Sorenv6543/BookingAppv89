#!/usr/bin/env node

/**
 * Enhanced PWA Optimization Script for Property Cleaning Scheduler
 * Analyzes and optimizes PWA performance for role-based architecture
 * Includes performance regression tracking and monitoring
 */

import { promises as fs } from 'fs'
import path from 'path'

// Performance regression tracking
const PERFORMANCE_HISTORY_FILE = 'performance-history.json'
const PERFORMANCE_THRESHOLDS = {
  maxTotalBundleSize: 2500, // KB - Total bundle size threshold
  maxChunkSize: 500, // KB - Individual chunk size threshold
  maxChunkCount: 25, // Maximum number of chunks
  roleBasedChunks: {
    'admin-components': { max: 200, target: 169 },
    'owner-components': { max: 80, target: 59 },
    'shared-ui': { max: 120, target: 84 },
    'admin-logic': { max: 80, target: 54 },
    'owner-logic': { max: 40, target: 19 },
    'shared-logic': { max: 50, target: 33 },
    'vuetify': { max: 1000, target: 874 },
    'vue-core': { max: 750, target: 683 },
    'calendar': { max: 650, target: 581 }
  }
}

async function analyzeBuildSize() {
  const distPath = path.resolve('dist')
  
  try {
    const files = await fs.readdir(distPath, { recursive: true })
    const assetSizes = {}
    let totalSize = 0
    
    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const filePath = path.join(distPath, file)
        const stats = await fs.stat(filePath)
        assetSizes[file] = stats.size
        totalSize += stats.size
      }
    }
    
    console.log('📊 PWA Bundle Analysis:')
    console.log('=======================')
    
    // Sort by size
    const sortedAssets = Object.entries(assetSizes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
    
    sortedAssets.forEach(([file, size]) => {
      const sizeKB = (size / 1024).toFixed(2)
      const status = getBundleStatus(file, size)
      console.log(`${file}: ${sizeKB} KB ${status}`)
    })
    
    // Total bundle analysis
    const totalSizeKB = (totalSize / 1024).toFixed(2)
    const totalStatus = totalSize / 1024 <= PERFORMANCE_THRESHOLDS.maxTotalBundleSize ? '✅' : '⚠️'
    console.log(`\nTotal Bundle Size: ${totalSizeKB} KB ${totalStatus}`)
    
    // Check for role-based chunks
    const roleChunks = Object.entries(assetSizes).filter(([file]) => 
      file.includes('admin') || file.includes('owner') || file.includes('shared') ||
      file.includes('vuetify') || file.includes('vue-core') || file.includes('calendar')
    )
    
    console.log('\n🎯 Role-Based Chunks Performance:')
    console.log('===================================')
    roleChunks.forEach(([file, size]) => {
      const sizeKB = (size / 1024).toFixed(2)
      const chunkType = getChunkType(file)
      const threshold = PERFORMANCE_THRESHOLDS.roleBasedChunks[chunkType]
      const status = threshold ? getChunkStatus(size / 1024, threshold) : '➖'
      console.log(`${file}: ${sizeKB} KB ${status}`)
    })
    
    // Performance regression analysis
    const currentSnapshot = {
      timestamp: new Date().toISOString(),
      totalSize: totalSize / 1024,
      chunkCount: Object.keys(assetSizes).length,
      roleBasedChunks: roleChunks.reduce((acc, [file, size]) => {
        const chunkType = getChunkType(file)
        if (chunkType !== 'unknown') {
          acc[chunkType] = size / 1024
        }
        return acc
      }, {})
    }
    
    await trackPerformanceRegression(currentSnapshot)
    
    return {
      success: true,
      totalSize: totalSize / 1024,
      chunkCount: Object.keys(assetSizes).length,
      roleChunks: roleChunks.length,
      snapshot: currentSnapshot
    }
    
  } catch (error) {
    console.error('❌ Error analyzing build:', error)
    return { success: false, error: error.message }
  }
}

function getBundleStatus(filename, sizeBytes) {
  const sizeKB = sizeBytes / 1024
  
  if (sizeKB <= 50) return '✅'
  if (sizeKB <= 200) return '🟢'
  if (sizeKB <= 500) return '🟡'
  if (sizeKB <= 1000) return '🟠'
  return '🔴'
}

function getChunkType(filename) {
  const lowerFile = filename.toLowerCase()
  
  if (lowerFile.includes('admin') && lowerFile.includes('component')) return 'admin-components'
  if (lowerFile.includes('owner') && lowerFile.includes('component')) return 'owner-components'
  if (lowerFile.includes('shared') && lowerFile.includes('ui')) return 'shared-ui'
  if (lowerFile.includes('admin') && lowerFile.includes('logic')) return 'admin-logic'
  if (lowerFile.includes('owner') && lowerFile.includes('logic')) return 'owner-logic'
  if (lowerFile.includes('shared') && lowerFile.includes('logic')) return 'shared-logic'
  if (lowerFile.includes('vuetify')) return 'vuetify'
  if (lowerFile.includes('vue-core') || lowerFile.includes('vue') && !lowerFile.includes('vuetify')) return 'vue-core'
  if (lowerFile.includes('calendar')) return 'calendar'
  
  return 'unknown'
}

function getChunkStatus(sizeKB, threshold) {
  if (sizeKB <= threshold.target) return '🎯' // At target
  if (sizeKB <= threshold.target * 1.1) return '✅' // Within 10% of target
  if (sizeKB <= threshold.max * 0.8) return '🟢' // Good
  if (sizeKB <= threshold.max) return '🟡' // Warning
  return '🔴' // Over threshold
}

async function trackPerformanceRegression(currentSnapshot) {
  try {
    let history = []
    
    // Load existing history
    try {
      const historyData = await fs.readFile(PERFORMANCE_HISTORY_FILE, 'utf8')
      history = JSON.parse(historyData)
    } catch (error) {
      // File doesn't exist yet, start fresh
      console.log('📝 Creating new performance history file...')
    }
    
    // Add current snapshot
    history.push(currentSnapshot)
    
    // Keep only last 30 builds
    if (history.length > 30) {
      history = history.slice(-30)
    }
    
    // Save updated history
    await fs.writeFile(PERFORMANCE_HISTORY_FILE, JSON.stringify(history, null, 2))
    
    // Analyze trends
    if (history.length >= 2) {
      const previous = history[history.length - 2]
      const current = history[history.length - 1]
      
      console.log('\n📈 Performance Trend Analysis:')
      console.log('===============================')
      
      const sizeDiff = current.totalSize - previous.totalSize
      const sizeChange = ((sizeDiff / previous.totalSize) * 100).toFixed(2)
      const sizeIcon = sizeDiff > 10 ? '🔴' : sizeDiff > 5 ? '🟡' : sizeDiff < -5 ? '🎯' : '✅'
      
      console.log(`Total Size Change: ${sizeChange >= 0 ? '+' : ''}${sizeChange}% (${sizeDiff.toFixed(2)} KB) ${sizeIcon}`)
      
      const chunkDiff = current.chunkCount - previous.chunkCount
      const chunkIcon = chunkDiff > 0 ? '🟡' : chunkDiff < 0 ? '🎯' : '✅'
      console.log(`Chunk Count Change: ${chunkDiff >= 0 ? '+' : ''}${chunkDiff} chunks ${chunkIcon}`)
      
      // Role-based chunk analysis
      console.log('\n🔍 Role-Based Chunk Changes:')
      for (const [chunkType, threshold] of Object.entries(PERFORMANCE_THRESHOLDS.roleBasedChunks)) {
        const currentSize = current.roleBasedChunks[chunkType] || 0
        const previousSize = previous.roleBasedChunks[chunkType] || 0
        const diff = currentSize - previousSize
        
        if (Math.abs(diff) > 1) { // Only show significant changes (>1KB)
          const change = ((diff / (previousSize || 1)) * 100).toFixed(1)
          const status = getChunkStatus(currentSize, threshold)
          console.log(`  ${chunkType}: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)} KB (${change}%) ${status}`)
        }
      }
      
      // Performance alerts
      const alerts = []
      if (sizeDiff > 100) alerts.push('⚠️ Bundle size increased by >100KB')
      if (current.totalSize > PERFORMANCE_THRESHOLDS.maxTotalBundleSize) alerts.push('🔴 Bundle size exceeds threshold')
      if (current.chunkCount > PERFORMANCE_THRESHOLDS.maxChunkCount) alerts.push('🟡 Too many chunks generated')
      
      if (alerts.length > 0) {
        console.log('\n🚨 Performance Alerts:')
        alerts.forEach(alert => console.log(`  ${alert}`))
      }
    }
    
  } catch (error) {
    console.error('❌ Error tracking performance regression:', error)
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

// Enhanced service worker analysis with performance monitoring
async function analyzeServiceWorkerPerformance() {
  try {
    const swPath = path.resolve('dev-dist/sw.js') // Check both dist and dev-dist
    let swStats, swContent
    
    try {
      swStats = await fs.stat(swPath)
      swContent = await fs.readFile(swPath, 'utf8')
    } catch (error) {
      // Try alternative path
      const altSwPath = path.resolve('dist/sw.js')
      swStats = await fs.stat(altSwPath)
      swContent = await fs.readFile(altSwPath, 'utf8')
    }
    
    const swSizeKB = (swStats.size / 1024).toFixed(2)
    
    console.log('\n🔧 Service Worker Performance Analysis:')
    console.log('=======================================')
    console.log(`Service Worker Size: ${swSizeKB} KB`)
    
    // Analyze caching strategies
    const hasRoleCaching = swContent.includes('role-based-chunks')
    const hasAPICaching = swContent.includes('api-cache')
    const hasImageCaching = swContent.includes('images')
    const hasStaleWhileRevalidate = swContent.includes('StaleWhileRevalidate')
    const hasNetworkFirst = swContent.includes('NetworkFirst')
    
    console.log(`Role-based caching: ${hasRoleCaching ? '✅ Enabled' : '❌ Missing'}`)
    console.log(`API caching: ${hasAPICaching ? '✅ Enabled' : '❌ Missing'}`)
    console.log(`Image caching: ${hasImageCaching ? '✅ Enabled' : '❌ Missing'}`)
    console.log(`Stale-While-Revalidate: ${hasStaleWhileRevalidate ? '✅ Enabled' : '❌ Missing'}`)
    console.log(`Network-First strategy: ${hasNetworkFirst ? '✅ Enabled' : '❌ Missing'}`)
    
    // Performance score calculation
    let swScore = 0
    if (hasRoleCaching) swScore += 30
    if (hasAPICaching) swScore += 25
    if (hasImageCaching) swScore += 20
    if (hasStaleWhileRevalidate) swScore += 15
    if (hasNetworkFirst) swScore += 10
    
    const scoreIcon = swScore >= 90 ? '🎯' : swScore >= 70 ? '✅' : swScore >= 50 ? '🟡' : '🔴'
    console.log(`SW Performance Score: ${swScore}/100 ${scoreIcon}`)
    
    return {
      size: swStats.size / 1024,
      score: swScore,
      strategies: {
        roleCaching: hasRoleCaching,
        apiCaching: hasAPICaching,
        imageCaching: hasImageCaching,
        staleWhileRevalidate: hasStaleWhileRevalidate,
        networkFirst: hasNetworkFirst
      }
    }
    
  } catch (error) {
    console.error('❌ Error analyzing service worker:', error)
    return { size: 0, score: 0, strategies: {} }
  }
}

// Import path optimization analysis
async function analyzeImportPaths() {
  console.log('\n📂 Import Path Optimization Analysis:')
  console.log('=====================================')
  
  const sourceFiles = await findSourceFiles()
  const importAnalysis = {
    efficient: 0,
    inefficient: 0,
    issues: []
  }
  
  for (const file of sourceFiles) {
    try {
      const content = await fs.readFile(file, 'utf8')
      const lines = content.split('\n')
      
      lines.forEach((line, index) => {
        if (line.trim().startsWith('import ')) {
          // Check for inefficient import patterns
          if (line.includes('import *') && !line.includes('vue')) {
            importAnalysis.inefficient++
            importAnalysis.issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              issue: 'Wildcard import detected',
              suggestion: 'Use specific imports instead of import *'
            })
          } else if (line.includes('lodash') && !line.includes('lodash/')) {
            importAnalysis.inefficient++
            importAnalysis.issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              issue: 'Full lodash import',
              suggestion: 'Use specific lodash functions: import debounce from "lodash/debounce"'
            })
          } else if (line.includes('vuetify') && line.includes('components') && !line.includes('vuetify/components')) {
            importAnalysis.inefficient++
            importAnalysis.issues.push({
              file: path.relative(process.cwd(), file),
              line: index + 1,
              issue: 'Non-specific Vuetify import',
              suggestion: 'Use tree-shakable imports from vuetify/components'
            })
          } else {
            importAnalysis.efficient++
          }
        }
      })
    } catch (error) {
      // Ignore files that can't be read
    }
  }
  
  const totalImports = importAnalysis.efficient + importAnalysis.inefficient
  const efficiency = totalImports > 0 ? (importAnalysis.efficient / totalImports * 100).toFixed(1) : 100
  const efficiencyIcon = efficiency >= 90 ? '🎯' : efficiency >= 80 ? '✅' : efficiency >= 70 ? '🟡' : '🔴'
  
  console.log(`Import Efficiency: ${efficiency}% ${efficiencyIcon}`)
  console.log(`Efficient imports: ${importAnalysis.efficient}`)
  console.log(`Inefficient imports: ${importAnalysis.inefficient}`)
  
  if (importAnalysis.issues.length > 0) {
    console.log('\n🔍 Import Optimization Opportunities:')
    importAnalysis.issues.slice(0, 10).forEach(issue => {
      console.log(`  ${issue.file}:${issue.line} - ${issue.issue}`)
      console.log(`    💡 ${issue.suggestion}`)
    })
    
    if (importAnalysis.issues.length > 10) {
      console.log(`  ... and ${importAnalysis.issues.length - 10} more issues`)
    }
  }
  
  return importAnalysis
}

async function findSourceFiles() {
  const sourceFiles = []
  
  async function scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await scanDirectory(fullPath)
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.vue'))) {
          sourceFiles.push(fullPath)
        }
      }
    } catch (error) {
      // Ignore directories that can't be read
    }
  }
  
  await scanDirectory('src')
  return sourceFiles
}

// Performance regression testing
async function performanceRegressionTest() {
  console.log('\n🧪 Performance Regression Test:')
  console.log('=================================')
  
  try {
    const history = JSON.parse(await fs.readFile(PERFORMANCE_HISTORY_FILE, 'utf8'))
    
    if (history.length < 2) {
      console.log('⚠️ Not enough history for regression testing')
      return { passed: true, note: 'Insufficient history' }
    }
    
    const current = history[history.length - 1]
    const baseline = history[0] // First recorded measurement
    const previous = history[history.length - 2]
    
    const tests = [
      {
        name: 'Bundle size regression',
        test: current.totalSize <= previous.totalSize * 1.1, // Max 10% increase
        current: current.totalSize,
        previous: previous.totalSize,
        threshold: '10% increase'
      },
      {
        name: 'Chunk count stability',
        test: current.chunkCount <= PERFORMANCE_THRESHOLDS.maxChunkCount,
        current: current.chunkCount,
        threshold: PERFORMANCE_THRESHOLDS.maxChunkCount
      },
      {
        name: 'Role-based chunk efficiency',
        test: Object.keys(current.roleBasedChunks).length >= 6, // Should have main role chunks
        current: Object.keys(current.roleBasedChunks).length,
        threshold: 6
      }
    ]
    
    let passedTests = 0
    tests.forEach(test => {
      const icon = test.test ? '✅' : '❌'
      console.log(`  ${icon} ${test.name}`)
      if (test.test) passedTests++
      else {
        console.log(`    Expected: ${test.threshold}, Current: ${test.current}`)
        if (test.previous) console.log(`    Previous: ${test.previous}`)
      }
    })
    
    const overall = passedTests === tests.length
    console.log(`\nOverall: ${overall ? '✅ PASSED' : '❌ FAILED'} (${passedTests}/${tests.length} tests passed)`)
    
    return {
      passed: overall,
      passedTests,
      totalTests: tests.length,
      details: tests
    }
    
  } catch (error) {
    console.error('❌ Error running regression tests:', error)
    return { passed: false, error: error.message }
  }
}

// Generate performance report
async function generatePerformanceReport() {
  console.log('\n📋 Generating Performance Report...')
  console.log('===================================')
  
  const bundleAnalysis = await analyzeBuildSize()
  const swAnalysis = await analyzeServiceWorkerPerformance()
  const importAnalysis = await analyzeImportPaths()
  const regressionTest = await performanceRegressionTest()
  
  const report = {
    timestamp: new Date().toISOString(),
    bundle: bundleAnalysis,
    serviceWorker: swAnalysis,
    imports: importAnalysis,
    regression: regressionTest,
    summary: {
      overallHealth: calculateOverallHealth(bundleAnalysis, swAnalysis, importAnalysis, regressionTest)
    }
  }
  
  // Save detailed report
  await fs.writeFile('performance-report.json', JSON.stringify(report, null, 2))
  
  console.log('\n🎯 Performance Summary:')
  console.log('=======================')
  console.log(`Overall Health: ${report.summary.overallHealth}% ${getHealthIcon(report.summary.overallHealth)}`)
  console.log(`Bundle Status: ${bundleAnalysis.success ? '✅' : '❌'}`)
  console.log(`Service Worker Score: ${swAnalysis.score}/100`)
  console.log(`Import Efficiency: ${((importAnalysis.efficient / (importAnalysis.efficient + importAnalysis.inefficient)) * 100).toFixed(1)}%`)
  console.log(`Regression Tests: ${regressionTest.passed ? '✅ PASSED' : '❌ FAILED'}`)
  
  console.log('\n📄 Detailed report saved to: performance-report.json')
  console.log('📊 Performance history saved to: performance-history.json')
  
  return report
}

function calculateOverallHealth(bundle, sw, imports, regression) {
  let score = 0
  
  // Bundle health (40% weight)
  if (bundle.success && bundle.totalSize <= PERFORMANCE_THRESHOLDS.maxTotalBundleSize) {
    score += 40
  } else if (bundle.success) {
    score += 20
  }
  
  // Service Worker health (25% weight)
  score += (sw.score / 100) * 25
  
  // Import efficiency (20% weight)
  const importEff = imports.efficient / (imports.efficient + imports.inefficient)
  score += importEff * 20
  
  // Regression test health (15% weight)
  if (regression.passed) {
    score += 15
  } else if (regression.passedTests) {
    score += (regression.passedTests / regression.totalTests) * 15
  }
  
  return Math.round(score)
}

function getHealthIcon(health) {
  if (health >= 90) return '🎯'
  if (health >= 80) return '✅'
  if (health >= 70) return '🟢'
  if (health >= 60) return '🟡'
  return '🔴'
}

// Command line interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'full'
  
  console.log('🚀 Property Cleaning Scheduler - Performance Monitor')
  console.log('====================================================')
  
  try {
    switch (command) {
      case 'bundle':
        await analyzeBuildSize()
        break
      case 'sw':
        await analyzeServiceWorkerPerformance()
        break
      case 'imports':
        await analyzeImportPaths()
        break
      case 'regression':
        await performanceRegressionTest()
        break
      case 'pwa':
        await checkPWAConfig()
        break
      case 'full':
      default:
        await generatePerformanceReport()
        break
    }
  } catch (error) {
    console.error('❌ Performance analysis failed:', error)
    process.exit(1)
  }
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
} 