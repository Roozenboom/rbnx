import { ExecutorContext, parseTargetString, runExecutor } from '@nx/devkit';
import type { NormalizedSchema } from '../schema';

export async function startDevServer(
  options: NormalizedSchema,
  context: ExecutorContext,
) {
  const { baseUrl, devServerTarget, skipServe } = options;
  if (!devServerTarget || skipServe) {
    return baseUrl;
  }

  const target = parseTargetString(devServerTarget, context.projectGraph);

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
  }>(target, {}, context)) {
    if (!output.success) {
      throw new Error(
        `Could not start dev server for ${target.project} project`,
      );
    }
    return baseUrl || (output.baseUrl as string);
  }
}
