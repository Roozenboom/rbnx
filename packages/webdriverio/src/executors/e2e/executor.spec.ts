import { exec } from 'node:child_process';
import * as startDevServerModule from './lib/start-dev-server';
import runExecutor from './executor';

jest.mock('node:child_process');
const pipe = jest.fn();
const execMock = jest.mocked(exec);

const startDevServer = jest
  .spyOn(startDevServerModule, 'startDevServer')
  .mockResolvedValueOnce('http://localhost:4200');

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

describe('Build Executor', () => {
  beforeEach(() => {
    execMock.mockImplementation((_command, _options, callback) => {
      callback(null, 'passed', '');
      return { stdout: { pipe } } as unknown as ReturnType<typeof execMock>;
    });
  });

  afterEach(jest.resetAllMocks);

  it('can run', async () => {
    const output = await runExecutor({ wdioConfig: 'wdio.config.ts' }, context);
    expect(execMock).toHaveBeenCalledWith(
      'npx wdio apps/test-e2e/wdio.generated.config.ts',
      expect.objectContaining({}),
      expect.any(Function)
    );
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(true);
  });

  it('should generate wdio config', async () => {
    const output = await runExecutor(
      {
        specs: ['src/e2e/**/*.spec.ts'],
        outputDir: './tmp',
        browsers: ['firefox'],
      },
      context
    );
    expect(execMock).toHaveBeenCalledWith(
      'npx wdio apps/test-e2e/wdio.generated.config.ts',
      expect.objectContaining({}),
      expect.any(Function)
    );
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(true);
  });

  it('should generate wdio config with headless capabilities', async () => {
    const output = await runExecutor(
      {
        specs: ['src/e2e/**/*.spec.ts'],
        outputDir: './tmp',
        browsers: ['chrome', 'firefox'],
        headless: true,
      },
      context
    );
    expect(execMock).toHaveBeenCalledWith(
      'npx wdio apps/test-e2e/wdio.generated.config.ts',
      expect.objectContaining({}),
      expect.any(Function)
    );
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(true);
  });

  it('should run single spec ', async () => {
    const output = await runExecutor(
      {
        wdioConfig: 'wdio.config.ts',
        spec: 'src/e2e/test.spec.ts',
      },
      context
    );
    expect(execMock).toHaveBeenCalledWith(
      'npx wdio apps/test-e2e/wdio.generated.config.ts --spec=src/e2e/test.spec.ts',
      expect.objectContaining({}),
      expect.any(Function)
    );
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(true);
  });

  it('should run single suite ', async () => {
    const output = await runExecutor(
      {
        specs: ['src/e2e/**/*.spec.ts'],
        outputDir: './tmp',
        suite: 'test',
      },
      context
    );
    expect(execMock).toHaveBeenCalledWith(
      'npx wdio apps/test-e2e/wdio.generated.config.ts --suite=test',
      expect.objectContaining({}),
      expect.any(Function)
    );
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(true);
  });

  it('should run with specified protocol', async () => {
    const output = await runExecutor(
      {
        specs: ['src/e2e/**/*.spec.ts'],
        protocol: 'devtools',
      },
      context
    );
    expect(execMock).toHaveBeenCalledWith(
      'npx wdio apps/test-e2e/wdio.generated.config.ts',
      expect.objectContaining({}),
      expect.any(Function)
    );
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(true);
  });

  it('should start dev server', async () => {
    const options = {
      specs: ['src/e2e/**/*.spec.ts'],
      skipServe: false,
    };
    const output = await runExecutor(options, context);

    expect(startDevServer).toHaveBeenCalledTimes(1);
    expect(startDevServer).toHaveBeenCalledWith(
      expect.objectContaining(options),
      context
    );
    expect(output.success).toBe(true);
  });

  it('handle execution errors', async () => {
    const error = new Error('some error');
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    execMock.mockImplementation((_command, _options, callback) => {
      callback(error, 'passed', '');
      return { stdout: { pipe } } as unknown as ReturnType<typeof execMock>;
    });

    const output = await runExecutor({ wdioConfig: 'wdio.config.ts' }, context);

    expect(pipe).toHaveBeenCalledTimes(1);
    expect(output.success).toBe(false);
    expect(consoleError).toBeCalledWith(error);
  });
});
