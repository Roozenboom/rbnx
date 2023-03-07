import { joinPathFragments } from '@nrwl/devkit';
import {
  checkFilesExist,
  cleanup,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  runCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('webdriverio e2e - mocha, devtools and no-auto-config', () => {
  beforeAll(() => {
    cleanup();
    ensureNxProject('@rbnx/webdriverio', 'dist/packages/webdriverio');
  });

  afterAll(async () => {
    await runNxCommandAsync('reset');
  });

  it('should initialize webdriverio nx-plugin', async () => {
    await runNxCommandAsync(
      `generate @rbnx/webdriverio:init --framework=mocha --protocol=devtools`
    );

    expect(() => checkFilesExist('package.json')).not.toThrow();

    const packageJson = readJson('package.json');

    expect(packageJson.devDependencies['@wdio/cli']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/local-runner']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/mocha-framework']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/devtools-service']).toBeTruthy();
    expect(packageJson.devDependencies['@types/jasmine']).toBeFalsy();
    expect(
      packageJson.devDependencies['@wdio/selenium-standalone-service']
    ).toBeFalsy();

    expect(() => checkFilesExist('wdio.base.config.ts')).not.toThrow();
  }, 120000);

  it('should create an e2e project and run the e2e executor', async () => {
    const project = uniq('app');
    const e2eProject = project + '-e2e';

    await runCommandAsync(`npm install --dev @nrwl/react@latest`);
    await runNxCommandAsync(
      `generate @nrwl/react:app ${project} --e2eTestRunner=none --linter=eslint --bundler vite`
    );
    await runNxCommandAsync(
      `generate @rbnx/webdriverio:project ${project} --no-auto-config`
    );

    const projectJsonPath = joinPathFragments(
      'apps',
      e2eProject,
      'project.json'
    );
    expect(() => checkFilesExist(projectJsonPath)).not.toThrow();
    const projectJson = readJson(projectJsonPath);
    expect(
      projectJson.targets.e2e.executor === '@rbnx/webdriverio:e2e'
    ).toBeTruthy();
    expect(
      projectJson.targets.e2e.options.wdioConfig === 'wdio.config.ts'
    ).toBeTruthy();

    const tsConfigJsonPath = joinPathFragments(
      'apps',
      e2eProject,
      'tsconfig.json'
    );
    expect(() => checkFilesExist(tsConfigJsonPath)).not.toThrow();
    const tsConfigJson = readJson(tsConfigJsonPath);
    expect(
      tsConfigJson.compilerOptions.types.includes('@wdio/mocha-framework')
    ).toBeTruthy();
    expect(
      tsConfigJson.compilerOptions.types.includes('@wdio/devtools-service')
    ).toBeTruthy();

    const result = await runNxCommandAsync(`e2e ${e2eProject}`);
    expect(result.stdout).toContain(
      `Successfully ran target e2e for project ${e2eProject}`
    );
  }, 180000);
});
