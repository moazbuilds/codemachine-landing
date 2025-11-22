#!/usr/bin/env node

/**
 * install.cjs
 * Cross-platform environment setup and dependency installation script
 *
 * This script:
 * - Detects the package manager (pnpm, npm, yarn)
 * - Installs/updates all project dependencies
 * - Is idempotent: safe to run multiple times
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function checkCommandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
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
      if (checkCommandExists(pm)) {
        return pm;
      }
      log(`Warning: packageManager specified as ${pm} but not found, falling back...`, colors.yellow);
    }
  } catch (error) {
    log(`Error reading package.json: ${error.message}`, colors.red);
    process.exit(1);
  }

  // Check lock files
  const projectRoot2 = path.resolve(__dirname, '..');
  if (fs.existsSync(path.join(projectRoot2, 'pnpm-lock.yaml')) && checkCommandExists('pnpm')) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectRoot2, 'yarn.lock')) && checkCommandExists('yarn')) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(projectRoot2, 'package-lock.json')) && checkCommandExists('npm')) {
    return 'npm';
  }

  // Default to npm
  if (checkCommandExists('npm')) {
    return 'npm';
  }

  log('Error: No package manager found (npm, pnpm, or yarn)', colors.red);
  process.exit(1);
}

function installDependencies() {
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  const packageManager = getPackageManager();

  log(`\n📦 Using package manager: ${packageManager}`, colors.blue);

  // Check if dependencies are already installed
  const needsInstall = !fs.existsSync(nodeModulesPath);

  if (needsInstall) {
    log('🔧 Installing dependencies...', colors.yellow);
  } else {
    log('🔄 Updating dependencies...', colors.yellow);
  }

  try {
    const installCommand = packageManager === 'yarn' ? 'yarn install' : `${packageManager} install`;

    execSync(installCommand, {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    log('\n✅ Dependencies installed successfully!', colors.green);
  } catch (error) {
    log('\n❌ Failed to install dependencies', colors.red);
    process.exit(1);
  }
}

function main() {
  try {
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);
    log('  Environment Setup & Dependency Install', colors.blue);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.blue);

    installDependencies();

    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green);
    log('  Setup Complete!', colors.green);
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green);

    process.exit(0);
  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
