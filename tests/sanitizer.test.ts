import { describe, it, expect } from 'vitest';
import { sanitizeHtml, isImageAllowed } from '../src/lib/sanitizer';

describe('sanitizer', () => {
  it('strips script', () => {
    expect(sanitizeHtml('<script>alert(1)</script>hi')).toBe('hi');
  });
  it('checks image host', () => {
    expect(isImageAllowed('https://cdn.example.com/img.png', ['example.com'])).toBe(true);
    expect(isImageAllowed('https://evil.com/img.png', ['example.com'])).toBe(false);
  });
});
