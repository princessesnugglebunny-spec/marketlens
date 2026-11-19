/**
 * Agent tools. Read-only + draft only; state-changing tools require approval.
 */
import { totalFees, netProfit, maxBuyPrice, dealVerdict, DEFAULT_FEES } from '../lib/fees';

export interface ToolDef {
  name: string;
  description: string;
  requiresApproval: boolean;
  run: (args: Record<string, unknown>) => Promise<unknown>;
}

export const TOOLS: ToolDef[] = [
  {
    name: 'calc_profit',
    description: 'Calculate net profit, max buy price and deal verdict for a listing.',
    requiresApproval: false,
    run: async (args) => {
      const buyPrice = Number(args.buyPrice ?? 0);
      const salePrice = Number(args.salePrice ?? 0);
      const targetRoi = Number(args.targetRoi ?? 0.3);
      const schedule = DEFAULT_FEES.find((f) => f.id === String(args.platform ?? 'local-cash')) ?? DEFAULT_FEES[DEFAULT_FEES.length - 1];
      const profit = netProfit(buyPrice, salePrice, schedule);
      const maxBuy = maxBuyPrice(salePrice, targetRoi, schedule);
      const verdict = dealVerdict(profit, salePrice);
      return { profit, maxBuy, verdict, fees: totalFees(schedule, salePrice) };
    },
  },
  {
    name: 'flag_restricted',
    description: 'Flag restricted claims in text.',
    requiresApproval: false,
    run: async (args) => {
      const text = String(args.text ?? '');
      const restricted = ['eco-friendly', 'non-toxic', 'antibacterial', 'bestseller', 'full refund', 'guarantee'];
      return restricted.filter((r) => text.toLowerCase().includes(r));
    },
  },
  {
    name: 'save_buy_log',
    description: 'Save an entry to the local buy log.',
    requiresApproval: true,
    run: async (args) => ({ saved: true, entry: args }),
  },
  {
    name: 'notify',
    description: 'Show a browser notification.',
    requiresApproval: true,
    run: async (args) => ({ notified: true, message: args.message }),
  },
];

export function findTool(name: string): ToolDef | undefined {
  return TOOLS.find((t) => t.name === name);
}
