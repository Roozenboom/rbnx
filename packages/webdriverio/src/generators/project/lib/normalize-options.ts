import { getWorkspaceLayout, joinPathFragments, names, Tree } from '@nx/devkit';
import type { NormalizedSchema, Schema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: Schema
): NormalizedSchema {
  const project = names(options.project).fileName;
  const e2eProjectName = project + '-e2e';

  if (options.protocol) {
    options.services = [
      ...(options.services ?? []),
      options.protocol === 'devtools' ? 'devtools' : 'selenium-standalone',
    ];
  }

  const projectDirectory = e2eProjectName;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = joinPathFragments(
    getWorkspaceLayout(tree).appsDir,
    projectDirectory
  );

  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
