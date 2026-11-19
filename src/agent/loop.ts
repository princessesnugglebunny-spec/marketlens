/**
 * Minimal agent loop: think -> tool -> observe. Tools requiring approval are
 * surfaced to the caller instead of executed.
 */

export interface AgentStep {
  thought: string;
  tool?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  pendingApproval?: boolean;
}

export async function runAgentStep(
  thought: string,
  toolName: string | undefined,
  args: Record<string, unknown> | undefined,
  execute: (name: string, args: Record<string, unknown>) => Promise<{ requiresApproval: boolean; result: unknown }>,
): Promise<AgentStep> {
  const step: AgentStep = { thought };
  if (!toolName) return step;
  step.tool = toolName;
  step.args = args ?? {};
  const { requiresApproval, result } = await execute(toolName, step.args);
  if (requiresApproval) {
    step.pendingApproval = true;
  } else {
    step.result = result;
  }
  return step;
}
