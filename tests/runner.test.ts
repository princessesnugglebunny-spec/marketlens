import { describe, it, expect } from 'vitest';
import { step } from '../src/agent/runner';

describe('runner', () => {
  it('executes non-approval tool', async () => {
    const s = await step('calc', 'calc_profit', { buyPrice: 50, salePrice: 100 });
    expect(s.pendingApproval).toBeUndefined();
    expect((s.result as { verdict: string }).verdict).toBeDefined();
  });
  it('marks approval-required tool pending', async () => {
    const s = await step('save', 'save_buy_log', { title: 'x' });
    expect(s.pendingApproval).toBe(true);
  });
  it('handles no tool', async () => {
    const s = await step('just thinking');
    expect(s.tool).toBeUndefined();
  });
});
