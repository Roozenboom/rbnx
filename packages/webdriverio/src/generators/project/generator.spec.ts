import {
  Tree,
  readProjectConfiguration,
  addProjectConfiguration,
  joinPathFragments,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import generator from './generator';
import type { Schema } from './schema';

describe('project generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'test', {
      root: './apps/test',
    });
  });

  it('should run successfully', async () => {
    const options: Schema = { project: 'test', tags: 'e2e,wdio' };
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test-e2e');
    expect(config.tags).toEqual(['e2e', 'wdio']);
  });

  it('should create target with headless browser option', async () => {
    const options: Schema = {
      project: 'test',
      protocol: 'webdriver',
      browsers: ['firefox'],
      headless: true,
    };
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test-e2e');
    expect(config.targets.e2e.options.browsers).toEqual(
      expect.arrayContaining(options.browsers)
    );
  });

  it('should create wdio config with capabilities', async () => {
    const options: Schema = {
      project: 'test',
      protocol: 'devtools',
      browsers: ['firefox'],
      capabilities: [{ browserName: 'chrome' }],
    };
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test-e2e');
    expect(config.targets.e2e.options.wdioConfig).toBe('wdio.config.ts');
    const wdioConfigPath = joinPathFragments(config.root, 'wdio.config.ts');
    expect(tree.exists(wdioConfigPath)).toBeTruthy();
  });

  it('should return an error message when provided project does not exist', async () => {
    await expect(
      generator(tree, {
        project: 'unknown-project',
      })
    ).rejects.toMatchInlineSnapshot(
      `"unknown-project is not a valid project in the workspace"`
    );
  });
});
