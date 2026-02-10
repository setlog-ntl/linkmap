#!/usr/bin/env node

/**
 * Linkmap CLI
 *
 * Commands:
 *   linkmap login          - Authenticate with Linkmap
 *   linkmap pull [project] - Pull .env file from Linkmap
 *   linkmap check          - Check for missing environment variables
 *   linkmap list           - List your projects
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_DIR = join(homedir(), '.linkmap');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const API_URL = process.env.LINKMAP_API_URL || 'https://linkmap.vercel.app';

interface Config {
  token?: string;
  defaultProject?: string;
}

function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

async function fetchAPI(path: string, token: string) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function login() {
  console.log('Linkmap Login');
  console.log('============');
  console.log('');
  console.log('1. Go to https://linkmap.vercel.app/settings/tokens');
  console.log('2. Create a new API token');
  console.log('3. Set the LINKMAP_TOKEN environment variable:');
  console.log('');
  console.log('   export LINKMAP_TOKEN=your_token_here');
  console.log('');
  console.log('Or save it to ~/.linkmap/config.json:');
  console.log(`   mkdir -p ${CONFIG_DIR}`);
  console.log(`   echo '{"token":"your_token"}' > ${CONFIG_FILE}`);
}

async function pull(projectId?: string) {
  const config = loadConfig();
  const token = process.env.LINKMAP_TOKEN || config.token;
  if (!token) {
    console.error('Error: Not authenticated. Run `linkmap login` first.');
    process.exit(1);
  }

  const pid = projectId || config.defaultProject;
  if (!pid) {
    console.error('Error: No project specified. Usage: linkmap pull <project-id>');
    process.exit(1);
  }

  console.log(`Pulling environment variables for project ${pid}...`);

  try {
    const data = await fetchAPI(`/env/download?project_id=${pid}&environment=development`, token);
    const envContent = data.content || '';
    writeFileSync('.env', envContent);
    console.log('Written to .env');
  } catch (error) {
    console.error(`Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function check() {
  // Read local .env file
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    console.log('No .env file found in current directory.');
    return;
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const localVars = new Set(
    envContent
      .split('\n')
      .filter((line) => line.trim() && !line.startsWith('#'))
      .map((line) => line.split('=')[0].trim())
  );

  console.log(`Found ${localVars.size} variables in .env`);

  // Check for common patterns
  const envExamplePath = join(process.cwd(), '.env.example');
  if (existsSync(envExamplePath)) {
    const exampleContent = readFileSync(envExamplePath, 'utf-8');
    const exampleVars = new Set(
      exampleContent
        .split('\n')
        .filter((line) => line.trim() && !line.startsWith('#'))
        .map((line) => line.split('=')[0].trim())
    );

    const missing = [...exampleVars].filter((v) => !localVars.has(v));
    if (missing.length > 0) {
      console.log(`\nMissing variables (from .env.example):`);
      missing.forEach((v) => console.log(`  - ${v}`));
    } else {
      console.log('\nAll variables from .env.example are present.');
    }
  }

  // Check for empty values
  const emptyVars = envContent
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .filter((line) => {
      const [, value] = line.split('=');
      return !value || value.trim() === '' || value.trim() === '""';
    })
    .map((line) => line.split('=')[0].trim());

  if (emptyVars.length > 0) {
    console.log(`\nVariables with empty values:`);
    emptyVars.forEach((v) => console.log(`  - ${v}`));
  }
}

async function list() {
  const config = loadConfig();
  const token = process.env.LINKMAP_TOKEN || config.token;
  if (!token) {
    console.error('Error: Not authenticated. Run `linkmap login` first.');
    process.exit(1);
  }

  try {
    const data = await fetchAPI('/projects', token);
    const projects = data.projects || data || [];
    console.log('Your projects:');
    console.log('');
    for (const p of projects) {
      console.log(`  ${p.id}  ${p.name}`);
    }
  } catch (error) {
    console.error(`Failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

// CLI entry point
const [, , command, ...args] = process.argv;

switch (command) {
  case 'login':
    login();
    break;
  case 'pull':
    pull(args[0]);
    break;
  case 'check':
    check();
    break;
  case 'list':
    list();
    break;
  default:
    console.log('Linkmap CLI v0.1.0');
    console.log('');
    console.log('Commands:');
    console.log('  linkmap login          Authenticate with Linkmap');
    console.log('  linkmap pull [project] Pull .env file from Linkmap');
    console.log('  linkmap check          Check for missing env vars');
    console.log('  linkmap list           List your projects');
}
