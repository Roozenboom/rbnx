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

describe('webdriverio e2e - defaults', () => {
  beforeAll(() => {
    cleanup();
    ensureNxProject('@rbnx/webdriverio', 'dist/packages/webdriverio');
  });

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
    expect(
      packageJson.devDependencies['@wdio/selenium-standalone-service']
    ).toBeTruthy();

    expect(() => checkFilesExist('wdio.base.config.ts')).not.toThrow();
  }, 120000);

  it('should create an e2e project and run the e2e executor', async () => {
    const project = uniq('app');
    const e2eProject = project + '-e2e';

    await runCommandAsync(`npm install --dev @nrwl/react@latest`);
    await runNxCommandAsync(
      `generate @nrwl/react:app ${project} --e2eTestRunner=none --linter=eslint --bundler vite`
    );
    await runNxCommandAsync(`generate @rbnx/webdriverio:project ${project}`);

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

    const result = await runNxCommandAsync(`e2e ${e2eProject} --headless`);
    expect(result.stdout).toContain(
      `Successfully ran target e2e for project ${e2eProject}`
    );
  }, 180000);
});
