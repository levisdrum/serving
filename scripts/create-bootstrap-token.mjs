#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node scripts/create-bootstrap-token.mjs <bootstrap-users.json>');
  process.exit(1);
}

const raw = readFileSync(filePath, 'utf8');
const parsed = JSON.parse(raw);
const minified = JSON.stringify(parsed);
const token = Buffer.from(minified, 'utf8')
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/g, '');

console.log(`serving-bootstrap:${token}`);
