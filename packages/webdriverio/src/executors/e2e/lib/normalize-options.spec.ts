import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { normalizeOptions } from './normalize-options';
import type { Schema } from '../schema';

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  workspaceRoot: '//Users/root',
}));

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

  it('should normalize wdioConfig paths', () => {
    const wdioConfigPaths = [
      { in: 'wdio.config.ts', out: './wdio.config' },
      { in: 'config/wdio.config.ts', out: './config/wdio.config' },
      { in: './config/wdio.config.ts', out: './config/wdio.config' },
      { in: 'apps/test-e2e/wdio.config.ts', out: './wdio.config' },
      {
        in: '../../apps/test-e2e/config/wdio.config.ts',
        out: './config/wdio.config',
      },
      {
        in: '../../apps/another-test-e2e/config/wdio.config.ts',
        out: './../another-test-e2e/config/wdio.config',
      },
      {
        in: '//Users/root/apps/another-test-e2e/config/wdio.config.ts',
        out: './../another-test-e2e/config/wdio.config',
      },
    ];

    for (const { in: wdioConfig, out } of wdioConfigPaths) {
      expect(
        normalizeOptions(tree, { ...options, wdioConfig }, context)
          .baseConfigPath
      ).toEqual(out);
    }
  });
});
