import { joinPathFragments } from '@nx/devkit';
import {
  checkFilesExist,
  cleanup,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  runCommandAsync,
  uniq,
} from '@nx/plugin/testing';

describe('webdriverio e2e - defaults', () => {
  const project = uniq('app');
  const e2eProject = project + '-e2e';

  beforeAll(async () => {
    cleanup();
    ensureNxProject('@rbnx/webdriverio', 'dist/packages/webdriverio');

    await runCommandAsync(`npm install --dev @nx/react@latest`);
    await runNxCommandAsync(
      `generate @nx/react:app ${project} --directory=apps/${project} --projectNameAndRootFormat=as-provided --e2eTestRunner=none --linter=eslint --bundler vite`
    );
  }, 100000);

  afterAll(() => {
    runNxCommandAsync('reset');
  });

  it('should initialize webdriverio nx-plugin', async () => {
    await runNxCommandAsync(`generate @rbnx/webdriverio:init`);

    expect(() => checkFilesExist('package.json')).not.toThrow();

    const packageJson = readJson('package.json');

    expect(packageJson.devDependencies['@wdio/cli']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/local-runner']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/jasmine-framework']).toBeTruthy();
    expect(packageJson.devDependencies['@types/jasmine']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/spec-reporter']).toBeTruthy();

    expect(() => checkFilesExist('wdio.base.config.ts')).not.toThrow();
  }, 60000);

  it('should create an e2e project and run the e2e executor', async () => {
    await runNxCommandAsync(`generate @rbnx/webdriverio:project ${project}`);

    const projectJsonPath = joinPathFragments(
      'apps',
      e2eProject,
      'project.json'
    );

    expect(() => checkFilesExist(projectJsonPath)).not.toThrow();

    const projectJson = readJson(projectJsonPath);
    expect(projectJson.targets.e2e.executor).toBe('@rbnx/webdriverio:e2e');

    const wdioConfigPath = joinPathFragments(
      'apps',
      e2eProject,
      'wdio.config.ts'
    );
    expect(projectJson.targets.e2e.options.wdioConfig).toBe(wdioConfigPath);
    expect(() => checkFilesExist(wdioConfigPath)).not.toThrow();

    const tsConfigJsonPath = joinPathFragments(
      'apps',
      e2eProject,
      'tsconfig.json'
    );
    expect(() => checkFilesExist(tsConfigJsonPath)).not.toThrow();
    const tsConfigJson = readJson(tsConfigJsonPath);
    expect(
      tsConfigJson.compilerOptions.types.includes('@wdio/globals/types')
    ).toBeTruthy();
    expect(
      tsConfigJson.compilerOptions.types.includes('@wdio/jasmine-framework')
    ).toBeTruthy();

    const result = await runNxCommandAsync(`e2e ${e2eProject} --headless`);
    expect(result.stdout).toContain(
      `Successfully ran target e2e for project ${e2eProject}`
    );
  }, 60000);
});
