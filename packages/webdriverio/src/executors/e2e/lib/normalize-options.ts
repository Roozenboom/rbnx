import {
  ExecutorContext,
  joinPathFragments,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import Path from 'node:path';
import {
  capabilitiesFilter,
  Framework,
  readPropertyFromConfig,
} from '../../../wdio';
import type { NormalizedSchema, Schema } from '../schema';

export function normalizeOptions(
  tree: Tree,
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

  let timeout = 60000;
  if (options.debug) {
    const MAX_SAFE_TIMEOUT = Math.pow(2, 31) - 1;
    timeout = MAX_SAFE_TIMEOUT;

    options.logLevel = 'debug';
    options.maxInstances = 1;
    options.framework = getFrameWorkFromConfig(tree, options, projectRoot);
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
    timeout,
  };
}

function getFrameWorkFromConfig(
  tree: Tree,
  options: Schema,
  projectRoot: string
): Framework {
  if (options.framework) return options.framework;

  if (options.wdioConfig) {
    const configPath = joinPathFragments(projectRoot, options.wdioConfig);

    if (tree.exists(configPath)) {
      const framework = readPropertyFromConfig<Framework>(
        tree,
        configPath,
        'framework'
      ).shift();
      if (framework) {
        return framework;
      }
    }
  }

  return readPropertyFromConfig<Framework>(
    tree,
    'wdio.base.config.ts',
    'framework'
  ).shift();
}
