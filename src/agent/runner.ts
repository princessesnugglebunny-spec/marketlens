/**
 * Agent runner: connects loop + tools with approval gating.
 */
import { runAgentStep, type AgentStep } from './loop';
import { findTool } from './tools';

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<{ requiresApproval: boolean; result: unknown }> {
  const tool = findTool(name);
  if (!tool) throw new Error(`unknown tool: ${name}`);
  if (tool.requiresApproval) return { requiresApproval: true, result: null };
  const result = await tool.run(args);
  return { requiresApproval: false, result };
}

export async function step(thought: string, toolName?: string, args?: Record<string, unknown>): Promise<AgentStep> {
  return runAgentStep(thought, toolName, args ?? {}, executeTool);
}
