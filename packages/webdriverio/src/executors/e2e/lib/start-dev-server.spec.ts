import { parseTargetString, runExecutor } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { startDevServer } from './start-dev-server';

async function* promiseToIterator(value) {
  yield await Promise.resolve(value);
}

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  runExecutor: jest.fn(),
  parseTargetString: jest.fn(),
}));

describe('start dev server', () => {
  beforeEach(jest.resetAllMocks);

  it('should not start server when skipServe is true', async () => {
    const baseUrl = 'base-url';
    const result = await startDevServer(
      {
        skipServe: true,
        devServerTarget: 'http://localhost',
        baseUrl,
      } as NormalizedSchema,
      {
        root: '',
        isVerbose: false,
        workspace: { version: 1, projects: {} },
        cwd: '',
      }
    );

    expect(runExecutor).not.toHaveBeenCalled();

    expect(result).toEqual(baseUrl);
  });

  it('should not start server when dev target url is missing', async () => {
    const baseUrl = 'base-url';
    const result = await startDevServer(
      { skipServe: false, baseUrl } as NormalizedSchema,
      {
        root: '',
        isVerbose: false,
        workspace: { version: 1, projects: {} },
        cwd: '',
      }
    );

    expect(runExecutor).not.toHaveBeenCalled();

    expect(result).toEqual(baseUrl);
  });

  it('should return the base url from results', async () => {
    const baseUrl = 'base-url';
    (runExecutor as jest.Mock).mockResolvedValue(
      promiseToIterator({ success: true, baseUrl })
    );
    (parseTargetString as jest.Mock).mockReturnValue({
      project: 'project',
      target: 'target',
      configuration: 'configuration',
    });
    const context = {
      root: '',
      isVerbose: false,
      workspace: { version: 1, projects: {} },
      cwd: '',
    };

    const result = await startDevServer(
      {
        skipServe: false,
        devServerTarget: 'project:target:configuration',
      } as NormalizedSchema,
      context
    );

    expect(result).toEqual(baseUrl);

    expect(runExecutor).toHaveBeenCalledTimes(1);
    expect(runExecutor).toHaveBeenCalledWith(
      {
        project: 'project',
        target: 'target',
        configuration: 'configuration',
      },
      {},
      context
    );
  });

  it('should throw an error when executor fails', async () => {
    (runExecutor as jest.Mock).mockResolvedValue(
      promiseToIterator({ success: false })
    );
    (parseTargetString as jest.Mock).mockReturnValue({
      project: 'unknown',
      target: 'target',
    });
    await expect(
      startDevServer(
        {
          skipServe: false,
          baseUrl: 'base-url',
          devServerTarget: 'unknown:target',
        } as NormalizedSchema,
        {
          root: '',
          isVerbose: false,
          workspace: { version: 1, projects: {} },
          cwd: '',
        }
      )
    ).rejects.toThrowError(
      new Error('Could not start dev server for unknown project')
    );
  });
});
