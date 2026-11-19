import { describe, it, expect, beforeEach } from 'vitest';
import { __resetMemStore } from '../src/lib/storage';
import { addLead, listLeads, updateLead } from '../src/lib/leads';

describe('leads', () => {
  beforeEach(() => __resetMemStore());
  it('adds and lists', async () => {
    await addLead({ buyerName: 'Bob', itemId: '1', itemTitle: 'Chair', offer: 80, status: 'new', notes: '' });
    const l = await listLeads();
    expect(l).toHaveLength(1);
  });
  it('updates status', async () => {
    const lead = await addLead({ buyerName: 'Bob', itemId: '1', itemTitle: 'Chair', offer: 80, status: 'new', notes: '' });
    await updateLead(lead.id, { status: 'won' });
    const l = await listLeads();
    expect(l[0].status).toBe('won');
  });
});
