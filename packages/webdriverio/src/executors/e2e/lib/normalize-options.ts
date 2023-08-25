import {
  joinPathFragments,
  offsetFromRoot,
  workspaceRoot,
  type ExecutorContext,
  type Tree,
} from '@nx/devkit';
import path from 'node:path';
import {
  capabilitiesFilter,
  readPropertyFromConfig,
  type Framework,
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

  const configPath = joinPathFragments(projectRoot, 'wdio.generated.config.ts');

  const baseConfigModuleName = options.wdioConfig
    ? 'config as wdioConfig'
    : 'wdioConfig';

  let baseConfigPath: string;
  if (options.wdioConfig) {
    const isAbsolute = path.isAbsolute(options.wdioConfig);

    const parsedPath = path.parse(
      tree.exists(options.wdioConfig) || isAbsolute
        ? options.wdioConfig
        : joinPathFragments(projectRoot, options.wdioConfig)
    );

    const from = isAbsolute
      ? joinPathFragments(workspaceRoot, projectRoot)
      : projectRoot;

    baseConfigPath = `./${joinPathFragments(
      path.relative(from, parsedPath.dir),
      parsedPath.name
    )}`;
  } else {
    baseConfigPath = joinPathFragments(
      offsetFromRoot(projectRoot),
      'wdio.base.config'
    );
  }

  const isVerbose = context.isVerbose;

  if (options.browsers) {
    options.capabilities = capabilitiesFilter(options);
  }

  if (options.protocol) {
    options.services = options.services ?? [];
    if (options.protocol === 'devtools') options.services.push('devtools');
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
