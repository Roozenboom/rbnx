import { Tree, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import generator from './generator';
import type { Schema } from './schema';

describe('webdriverio generator', () => {
  let tree: Tree;
  const options: Schema = {
    runner: 'local',
    framework: 'mocha',
    reporters: ['dot'],
    services: [],
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@wdio/cli']).toBeDefined();
  });
});
