import {
  ExecutorContext,
  joinPathFragments,
  offsetFromRoot,
} from '@nrwl/devkit';
import Path from 'node:path';
import { capabilitiesFilter } from '../../../wdio';
import type { NormalizedSchema, Schema } from '../schema';

export function normalizeOptions(
  options: Schema,
  context: ExecutorContext
): NormalizedSchema {
  const projectName = context.projectName;
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName]?.root ?? '';

  const configFile = 'wdio.generated.config.ts';
  const configPath = joinPathFragments(projectRoot, configFile);

  const baseConfigModuleName = options.wdioConfig
    ? 'config as wdioConfig'
    : 'wdioConfig';
  const baseConfigPath = options.wdioConfig
    ? `./${Path.parse(options.wdioConfig).name}`
    : joinPathFragments(offsetFromRoot(projectRoot), 'wdio.base.config');

  const isVerbose = context.isVerbose;

  if (options.browsers) {
    options.capabilities = capabilitiesFilter(options);
  }

  if (options.protocol) {
    options.services = [
      ...(options.services ?? []),
      options.protocol === 'devtools' ? 'devtools' : 'selenium-standalone',
    ];
  }

  return {
    ...options,
    configFile,
    configPath,
    baseConfigModuleName,
    baseConfigPath,
    isVerbose,
    projectName,
    projectRoot,
  };
}
