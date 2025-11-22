#!/usr/bin/env node

/**
 * lint.cjs
 * Cross-platform linting script
 *
 * This script:
 * - Ensures dependencies are installed via install.cjs
 * - Runs ESLint on the project
 * - Outputs results in JSON format to stdout
 * - Only reports syntax errors and critical warnings
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function log(message) {
  console.error(message);
}

function ensureDependencies() {
  const installScript = path.join(__dirname, 'install.cjs');

  if (!fs.existsSync(installScript)) {
    log('Error: install.cjs not found');
    process.exit(1);
  }

  try {
    execSync(`node "${installScript}"`, {
      stdio: 'ignore',
    });
  } catch (error) {
    log('Failed to ensure dependencies');
    process.exit(1);
  }
}

function getPackageManager() {
  const projectRoot = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    log('Error: package.json not found');
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (packageJson.packageManager) {
      return packageJson.packageManager.split('@')[0];
    }
  } catch (error) {
    log(`Error reading package.json: ${error.message}`);
    process.exit(1);
  }

  const projectRoot2 = path.resolve(__dirname, '..');
  if (fs.existsSync(path.join(projectRoot2, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectRoot2, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}

function checkESLintInstalled() {
  const projectRoot = path.resolve(__dirname, '..');
  const eslintPath = path.join(projectRoot, 'node_modules', '.bin', 'eslint');
  const eslintPathWin = path.join(projectRoot, 'node_modules', '.bin', 'eslint.cmd');

  return fs.existsSync(eslintPath) || fs.existsSync(eslintPathWin);
}

function runLint() {
  const projectRoot = path.resolve(__dirname, '..');
  const packageManager = getPackageManager();

  if (!checkESLintInstalled()) {
    log('ESLint not found, installing...');
    try {
      const installCmd = packageManager === 'yarn' ? 'yarn add -D eslint' : `${packageManager} install -D eslint`;
      execSync(installCmd, {
        cwd: projectRoot,
        stdio: 'ignore',
      });
    } catch (error) {
      log('Failed to install ESLint');
      process.exit(1);
    }
  }

  // Determine ESLint executable based on platform
  let eslintCmd;
  if (process.platform === 'win32') {
    eslintCmd = path.join(projectRoot, 'node_modules', '.bin', 'eslint.cmd');
  } else {
    eslintCmd = path.join(projectRoot, 'node_modules', '.bin', 'eslint');
  }

  // Check if we should use package manager's run command
  const usePackageManager = !fs.existsSync(eslintCmd);

  try {
    let output;
    if (usePackageManager) {
      // Fallback to using package manager
      const lintCommand = packageManager === 'npm' ? 'npm run lint -- --format=json' :
                          packageManager === 'yarn' ? 'yarn lint --format=json' :
                          `${packageManager} run lint --format=json`;

      output = execSync(lintCommand, {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } else {
      // Use ESLint directly
      output = execSync(`"${eslintCmd}" . --ext ts,tsx --format=json`, {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    }

    // Parse ESLint JSON output
    const results = JSON.parse(output);
    const formattedErrors = formatESLintResults(results);

    // Output formatted results as JSON
    console.log(JSON.stringify(formattedErrors, null, 2));

    // Exit with appropriate code
    if (formattedErrors.length > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    if (error.stdout) {
      try {
        const results = JSON.parse(error.stdout);
        const formattedErrors = formatESLintResults(results);

        console.log(JSON.stringify(formattedErrors, null, 2));

        process.exit(formattedErrors.length > 0 ? 1 : 0);
      } catch (parseError) {
        log('Failed to parse ESLint output');
        console.log(JSON.stringify([], null, 2));
        process.exit(1);
      }
    } else {
      log('Failed to run ESLint');
      console.log(JSON.stringify([], null, 2));
      process.exit(1);
    }
  }
}

function formatESLintResults(eslintResults) {
  const errors = [];

  for (const file of eslintResults) {
    if (!file.messages || file.messages.length === 0) {
      continue;
    }

    for (const message of file.messages) {
      // Only include errors and warnings (severity 2 for errors, 1 for warnings)
      if (message.severity >= 1) {
        errors.push({
          type: message.severity === 2 ? 'error' : 'warning',
          path: path.relative(path.resolve(__dirname, '..'), file.filePath),
          obj: message.ruleId || 'unknown',
          message: message.message,
          line: message.line || 0,
          column: message.column || 0,
        });
      }
    }
  }

  return errors;
}

function main() {
  try {
    ensureDependencies();
    runLint();
  } catch (error) {
    log(`Unexpected error: ${error.message}`);
    console.log(JSON.stringify([], null, 2));
    process.exit(1);
  }
}

main();
