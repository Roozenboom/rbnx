import { formatFiles, Tree } from '@nrwl/devkit';
import type { Schema } from './schema';
import { addDependencies } from './lib/add-dependencies';
import { createWdioBaseConfigFile } from './lib/create-config-file';
import { normalizeOptions } from './lib/normalize-options';

export default async function initGenerator(tree: Tree, options: Schema) {
  const { skipFormat } = options;
  const normalizedOptions = normalizeOptions(options);

  if (!tree.exists('wdio.base.config.ts')) {
    createWdioBaseConfigFile(tree, normalizedOptions);
  }

  const installTask = addDependencies(tree, normalizedOptions);

  if (!skipFormat) await formatFiles(tree);

  return installTask;
}
