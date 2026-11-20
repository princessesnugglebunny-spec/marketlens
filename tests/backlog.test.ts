import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { scanBacklog, getUnprocessed, markProcessed } from '../src/lib/backlog';

describe('backlog', () => {
  beforeEach(() => __resetMemStore());
  it('scans and finds unprocessed', async () => {
    await scanBacklog(['c1', 'c2']);
    const unproc = await getUnprocessed();
    expect(unproc).toHaveLength(2);
  });
  it('marks processed', async () => {
    await scanBacklog(['c1']);
    await markProcessed('c1');
    const unproc = await getUnprocessed();
    expect(unproc).toHaveLength(0);
  });
});
