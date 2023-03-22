import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { filterWdioOptions } from '../../../wdio';
import type { NormalizedSchema } from '../schema';

export function addProjectConfig(tree: Tree, options: NormalizedSchema) {
  const { parsedTags, projectRoot, project } = options;
  const e2eProjectName = project + '-e2e';

  addProjectConfiguration(tree, e2eProjectName, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      e2e: {
        executor: '@rbnx/webdriverio:e2e',
        options: {
          wdioConfig: 'wdio.config.ts',
          ...filterWdioOptions(options),
        },
      },
    },
    tags: parsedTags,
    implicitDependencies: [project],
  });
}
