import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

test('build artifacts present', async () => {
  const dist = join(process.cwd(), 'dist');
  for (const f of ['manifest.json', 'content.js', 'background.js', 'popup.html', 'options.html']) {
    expect(existsSync(join(dist, f))).toBeTruthy();
  }
});

test('manifest has mv3', async () => {
  const fs = await import('node:fs');
  const m = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'));
  expect(m.manifest_version).toBe(3);
  expect(m.name).toBe('MarketLens');
});
