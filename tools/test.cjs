#!/usr/bin/env node

/**
 * test.cjs
 * Cross-platform test execution script
 *
 * This script:
 * - Ensures dependencies are installed via install.cjs
 * - Runs the project test suite
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.error(`${color}${message}${colors.reset}`);
}

function getPackageManager() {
  const projectRoot = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    log('Error: package.json not found', colors.red);
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check packageManager field
    if (packageJson.packageManager) {
      const pm = packageJson.packageManager.split('@')[0];
      return pm;
    }
  } catch (error) {
    log(`Error reading package.json: ${error.message}`, colors.red);
    process.exit(1);
  }

  // Check lock files
  const projectRoot2 = path.resolve(__dirname, '..');
  if (fs.existsSync(path.join(projectRoot2, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectRoot2, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}

function hasTestScript() {
  const projectRoot = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.scripts && packageJson.scripts.test;
  } catch (error) {
    return false;
  }
}

function ensureDependencies() {
  const installScript = path.join(__dirname, 'install.cjs');

  if (!fs.existsSync(installScript)) {
    log('Error: install.cjs not found', colors.red);
    process.exit(1);
  }

  log('🔍 Checking dependencies...', colors.blue);

  try {
    execSync(`node "${installScript}"`, {
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' },
    });
  } catch (error) {
    log('❌ Failed to ensure dependencies', colors.red);
    process.exit(1);
  }
}

function runTests() {
  const projectRoot = path.resolve(__dirname, '..');
  const packageManager = getPackageManager();

  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
  log('  Running Tests', colors.blue);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);

  // Check if test script exists
  if (!hasTestScript()) {
    log('\n⚠️  No test script defined in package.json', colors.yellow);
    log('ℹ️  Skipping tests...', colors.blue);
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green);
    log('  Tests Complete (No tests to run)', colors.green);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green);
    process.exit(0);
  }

  // Determine the command based on package manager
  let command, args;
  if (packageManager === 'npm') {
    command = 'npm';
    args = ['run', 'test'];
  } else if (packageManager === 'yarn') {
    command = 'yarn';
    args = ['test'];
  } else {
    command = packageManager;
    args = ['run', 'test'];
  }

  log(`\n🧪 Running: ${command} ${args.join(' ')}\n`, colors.green);

  // Use spawn to stream output in real-time
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.on('error', (error) => {
    log(`\n❌ Failed to run tests: ${error.message}`, colors.red);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code === 0) {
      log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green);
      log('  ✅ All Tests Passed!', colors.green);
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green);
      process.exit(0);
    } else {
      log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.red);
      log(`  ❌ Tests Failed (exit code ${code})`, colors.red);
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.red);
      process.exit(code || 1);
    }
  });

  // Handle termination signals
  process.on('SIGINT', () => {
    log('\n\n⏹️  Stopping tests...', colors.yellow);
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    log('\n\n⏹️  Stopping tests...', colors.yellow);
    child.kill('SIGTERM');
  });
}

function main() {
  try {
    ensureDependencies();
    runTests();
  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
