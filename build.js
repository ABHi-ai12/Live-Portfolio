import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('--- Building Main Application ---');
  execSync('npm run build:main', { stdio: 'inherit', cwd: __dirname });

  console.log('\n--- Installing Admin Application Dependencies ---');
  const adminDir = path.join(__dirname, 'admin');
  const adminNodeModules = path.join(adminDir, 'node_modules');
  const shouldInstallAdminDeps = process.env.CI || !fs.existsSync(adminNodeModules);
  if (shouldInstallAdminDeps) {
    execSync('npm install', { stdio: 'inherit', cwd: adminDir });
  } else {
    console.log('Admin dependencies already installed; skipping install.');
  }

  console.log('\n--- Building Admin Application ---');
  execSync('npm run build', { stdio: 'inherit', cwd: adminDir });

  console.log('\n--- Copying Admin Build to Main Dist ---');
  const adminDist = path.join(adminDir, 'dist');
  const targetDist = path.join(__dirname, 'dist', 'admin');
  
  if (fs.existsSync(adminDist)) {
    fs.rmSync(targetDist, { recursive: true, force: true });
    fs.cpSync(adminDist, targetDist, { recursive: true });
    console.log(`Successfully copied admin build to ${targetDist}`);
  } else {
    console.error('Admin dist folder not found!');
    process.exit(1);
  }
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}
