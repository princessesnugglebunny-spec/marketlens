import { describe, it, expect } from 'vitest';
import { checkImagePixels } from '../src/lib/pixels';

describe('pixels', () => {
  it('detects small dimension', () => {
    const data = new Uint8ClampedArray(4 * 4 * 4).fill(255);
    const r = checkImagePixels(data, 4, 4);
    expect(r.ok).toBe(false);
    expect(r.issues).toContain('min dimension 4 < 1000');
  });
});
