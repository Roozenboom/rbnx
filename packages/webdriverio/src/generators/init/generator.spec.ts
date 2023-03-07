import { Tree, readJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import generator from './generator';
import type { Schema } from './schema';

describe('webdriverio generator', () => {
  let appTree: Tree;
  const options: Schema = {
    runner: 'local',
    framework: 'mocha',
    reporters: ['dot'],
    services: [],
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['@wdio/cli']).toBeDefined();
  });
});
