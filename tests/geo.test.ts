import { describe, it, expect } from 'vitest';
import { parseCity, distanceMiles, classifyCity, DEFAULT_SETTINGS } from '../src/lib/geo';

describe('geo', () => {
  it('parseCity', () => {
    expect(parseCity('Springfield, IL')).toEqual({ city: 'Springfield', state: 'IL' });
    expect(parseCity('nope')).toBeNull();
  });
  it('distanceMiles roughly', () => {
    const d = distanceMiles({ lat: 40.7128, lon: -74.006 }, { lat: 34.0522, lon: -118.2437 });
    expect(d).toBeGreaterThan(2400);
    expect(d).toBeLessThan(2500);
  });
  it('classifyCity in/out/unknown', () => {
    const table = new Map();
    table.set('springfield|il', { name: 'Springfield', state: 'IL', lat: 39.8, lon: -89.65 });
    table.set('chicago|il', { name: 'Chicago', state: 'IL', lat: 41.88, lon: -87.63 });
    const settings = { ...DEFAULT_SETTINGS, radiusMiles: 40, allowGrace: false };
    expect(classifyCity({ city: 'Springfield', state: 'IL' }, { city: 'Chicago', state: 'IL' }, table, settings)).toBe('out');
    expect(classifyCity({ city: 'Nope', state: 'XX' }, { city: 'Chicago', state: 'IL' }, table, settings)).toBe('unknown');
  });
});
