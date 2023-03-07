import {
  Tree,
  readProjectConfiguration,
  addProjectConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import generator from './generator';
import type { Schema } from './schema';

describe('project generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(appTree, 'test', {
      root: './apps/test',
    });
  });

  it('should run successfully', async () => {
    const options: Schema = { project: 'test', tags: 'e2e,wdio' };
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config.tags).toEqual(['e2e', 'wdio']);
  });

  it('should create wdio config with headless browser capability', async () => {
    const options: Schema = {
      project: 'test',
      browsers: ['firefox'],
      headless: true,
    };
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config.targets.e2e.options.browsers).toEqual(
      expect.arrayContaining(options.browsers)
    );
  });

  it('should create wdio config with capabilities', async () => {
    const options: Schema = {
      project: 'test',
      autoConfig: false,
      browsers: ['firefox'],
      capabilities: [{ browserName: 'chrome' }],
    };
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-e2e');
    expect(config.targets.e2e.options.wdioConfig).toBe('wdio.config.ts');
    const wdioConfigPath = joinPathFragments(config.root, 'wdio.config.ts');
    expect(appTree.exists(wdioConfigPath)).toBeTruthy();
  });
});
