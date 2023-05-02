import { Tree, joinPathFragments, generateFiles } from '@nx/devkit';
import { Schema } from '../schema';

export function createWdioBaseConfigFile(tree: Tree, options: Schema) {
  generateFiles(tree, joinPathFragments(__dirname, '..', 'files'), '.', {
    tmpl: '',
    ...options,
  });
}
