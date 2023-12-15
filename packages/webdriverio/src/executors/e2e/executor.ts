import { ExecutorContext, Tree, workspaceRoot } from '@nx/devkit';
import { FsTree } from 'nx/src/generators/tree';
import { normalizeOptions } from './lib/normalize-options';
import { generateWdioConfig, runWdio, unlinkWdioConfig } from './lib/run-wdio';
import { startDevServer } from './lib/start-dev-server';
import type { Schema } from './schema';

export default async function runExecutor(
  options: Schema,
  context: ExecutorContext,
) {
  const tree: Tree = new FsTree(workspaceRoot, false);

  const wdioOptions = normalizeOptions(tree, options, context);
  try {
    wdioOptions.baseUrl = await startDevServer(wdioOptions, context);

    await generateWdioConfig(tree, wdioOptions);
    await runWdio(wdioOptions);
    await unlinkWdioConfig(wdioOptions);

    return { success: true };
  } catch (error) {
    await unlinkWdioConfig(wdioOptions);
    if (context.isVerbose) console.error(error);

    return { success: false };
  }
}
