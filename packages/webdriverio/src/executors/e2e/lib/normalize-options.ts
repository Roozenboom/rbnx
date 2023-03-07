import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import type { NormalizedSchema, Schema } from '../schema';

export function normalizeOptions(
  options: Schema,
  context: ExecutorContext
): NormalizedSchema {
  const projectName = context.projectName;
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName]?.root ?? '';
  const configFile = options.wdioConfig
    ? options.wdioConfig
    : 'wdio.generated.config.ts';
  const configPath = joinPathFragments(projectRoot, configFile);
  const isVerbose = context.isVerbose;

  return {
    ...options,
    configFile,
    configPath,
    isVerbose,
    projectName,
    projectRoot,
  };
}
