import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { normalizeOptions } from './normalize-options';
import type { Schema } from '../schema';

describe('normalize options', () => {
  let tree: Tree;
  const options: Schema = {
    framework: 'mocha',
    wdioConfig: 'wdio.config.ts',
  };

  const context = {
    root: '/root',
    projectName: 'test-e2e',
    projectsConfigurations: {
      version: 2,
      projects: {
        'test-e2e': {
          root: './apps/test-e2e',
        },
      },
    },
    nxJsonConfiguration: {
      npmScope: 'test',
    },
    isVerbose: true,
    cwd: '/root',
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();

    tree.write(
      './apps/test-e2e/wdio.config.ts',
      `export const config: { framework:'jasmine' }`
    );

    console.log(tree.exists('./apps/test-e2e/wdio.config.ts'));
  });

  it('should normalize options', async () => {
    const output = normalizeOptions(tree, options, context);

    expect(output.projectRoot).toEqual('./apps/test-e2e');
    expect(output.baseConfigPath).toEqual('./wdio.config');
    expect(output.timeout).toEqual(60000);
  });

  it('should normalize debug options', async () => {
    const output = normalizeOptions(tree, { ...options, debug: true }, context);

    expect(output.logLevel).toEqual('debug');
    expect(output.timeout).toBeGreaterThan(60000);
  });

  it('should normalize relative wdioConfig paths', async () => {
    const output1 = normalizeOptions(
      tree,
      { ...options, wdioConfig: 'config/wdio.config.ts' },
      context
    );
    const output2 = normalizeOptions(
      tree,
      { ...options, wdioConfig: './config/wdio.config.ts' },
      context
    );
    const output3 = normalizeOptions(
      tree,
      { ...options, wdioConfig: '../../config/wdio.config.ts' },
      context
    );
    const output4 = normalizeOptions(
      tree,
      { ...options, wdioConfig: '.wdio.config.ts' },
      context
    );
    const output5 = normalizeOptions(
      tree,
      { ...options, wdioConfig: '.config/wdio.config.ts' },
      context
    );

    expect(output1.baseConfigPath).toEqual('./config/wdio.config');
    expect(output2.baseConfigPath).toEqual('./config/wdio.config');
    expect(output3.baseConfigPath).toEqual('../../config/wdio.config');
    expect(output4.baseConfigPath).toEqual('./.wdio.config');
    expect(output5.baseConfigPath).toEqual('./.config/wdio.config');
  });

  it('should normalize absolute wdioConfig paths', async () => {
    const output = normalizeOptions(
      tree,
      { ...options, wdioConfig: '/config/wdio.config.ts' },
      context
    );

    expect(output.baseConfigPath).toEqual('/config/wdio.config');
  });
});
