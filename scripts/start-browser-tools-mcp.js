#!/usr/bin/env node

/**
 * Browser Tools MCP Server Starter
 * 
 * This script starts the Browser Tools MCP server for browser automation
 * and testing capabilities.
 */

import { spawn } from 'child_process';

async function startBrowserToolsMCP() {
  try {
    console.log('🚀 Starting Browser Tools MCP Server...');
    
    // Start the enhanced browser tools MCP server
    const server = spawn('npx', ['@eqiz/browser-tools-mcp-enhanced'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });
    
    server.on('error', (error) => {
      console.error('❌ Failed to start Browser Tools MCP server:', error);
      process.exit(1);
    });
    
    server.on('close', (code) => {
      console.log(`📱 Browser Tools MCP server exited with code ${code}`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Browser Tools MCP server...');
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down Browser Tools MCP server...');
      server.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('❌ Error starting Browser Tools MCP server:', error);
    process.exit(1);
  }
}

// Start the server
startBrowserToolsMCP(); 