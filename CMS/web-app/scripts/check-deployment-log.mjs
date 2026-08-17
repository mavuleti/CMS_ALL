import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const deploymentLogPath = resolve('DEPLOYMENTS.md');
const deploymentLog = readFileSync(deploymentLogPath, 'utf8');
const versionHeadingPattern = new RegExp(`^##\\s+${packageJson.version.replaceAll('.', '\\.')}\\s+-\\s+\\d{4}-\\d{2}-\\d{2}\\s*$`, 'm');

if (!versionHeadingPattern.test(deploymentLog)) {
  console.error(`DEPLOYMENTS.md is missing an entry for version ${packageJson.version}.`);
  console.error(`Add a heading like: ## ${packageJson.version} - YYYY-MM-DD`);
  process.exit(1);
}

console.log(`DEPLOYMENTS.md includes version ${packageJson.version}.`);
