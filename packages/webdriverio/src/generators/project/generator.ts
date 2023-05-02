import { formatFiles, getProjects, Tree } from '@nx/devkit';
import initGenerator from '../init/generator';
import { addProjectConfig } from './lib/add-project-config';
import { addProjectFiles } from './lib/add-project-files';
import { normalizeOptions } from './lib/normalize-options';
import type { Schema } from './schema';

export default async function projectGenerator(tree: Tree, options: Schema) {
  const { project, skipFormat } = options;
  const normalizedOptions = normalizeOptions(tree, options);

  const workspaceProjects = getProjects(tree);
  if (project && !workspaceProjects.has(project)) {
    return Promise.reject(`${project} is not a valid project in the workspace`);
  }

  const initTask = await initGenerator(tree, {
    ...normalizedOptions,
    skipFormat: true,
  });

  addProjectConfig(tree, normalizedOptions);
  await addProjectFiles(tree, normalizedOptions);

  if (!skipFormat) await formatFiles(tree);

  return initTask;
}
