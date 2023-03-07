import { Tree, joinPathFragments, generateFiles } from '@nrwl/devkit';
import { Schema } from '../schema';

export function createWdioBaseConfigFile(tree: Tree, options: Schema) {
  generateFiles(tree, joinPathFragments(__dirname, '..', 'files'), '.', {
    tmpl: '',
    ...options,
  });
}
