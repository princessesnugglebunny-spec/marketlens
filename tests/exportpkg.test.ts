import { describe, it, expect } from 'vitest';
import { buildExportPackage } from '../src/lib/exportpkg';

describe('exportpkg', () => {
  it('builds package', () => {
    const draft = { title: 'Good title', bullets: [], description: '', searchTerms: '' };
    const pkg = buildExportPackage(draft);
    expect(pkg.allPassed).toBe(true);
  });
});
