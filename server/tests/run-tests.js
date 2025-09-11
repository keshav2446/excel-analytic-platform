#!/usr/bin/env node

/**
 * Excel Analytics Platform - Backend Test Runner
 * 
 * This script runs tests to verify:
 * 1. MongoDB connection
 * 2. API endpoints functionality
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.blue}=== Excel Analytics Platform - Backend Tests ===${colors.reset}\n`);

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error(`${colors.red}Error: .env file not found at ${envPath}${colors.reset}`);
  console.log(`${colors.yellow}Please create a .env file with the following variables:${colors.reset}`);
  console.log(`${colors.cyan}PORT=5000
MONGO_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-secret-key${colors.reset}`);
  process.exit(1);
}

// Check MongoDB connection
console.log(`${colors.cyan}Testing MongoDB connection...${colors.reset}`);
try {
  execSync('npx jest tests/db.test.js --detectOpenHandles', { stdio: 'inherit' });
  console.log(`${colors.green}✓ MongoDB connection successful${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ MongoDB connection failed${colors.reset}`);
  console.error(`${colors.yellow}Please check your MONGO_URI in the .env file${colors.reset}\n`);
  process.exit(1);
}

// Test API endpoints
console.log(`${colors.cyan}Testing API endpoints...${colors.reset}`);
try {
  execSync('npx jest tests/api.test.js --detectOpenHandles', { stdio: 'inherit' });
  console.log(`${colors.green}✓ API endpoints tests passed${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ API endpoints tests failed${colors.reset}\n`);
  process.exit(1);
}

console.log(`${colors.bright}${colors.green}All tests passed! Backend is properly configured.${colors.reset}`);
console.log(`${colors.blue}You can start the server with:${colors.reset}`);
console.log(`${colors.cyan}npm run dev${colors.reset}`);
