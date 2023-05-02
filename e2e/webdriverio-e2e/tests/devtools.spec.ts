import { joinPathFragments, names } from '@nx/devkit';
import {
  checkFilesExist,
  cleanup,
  ensureNxProject,
  runNxCommandAsync,
  runCommandAsync,
  updateFile,
  uniq,
  readJson,
} from '@nx/plugin/testing';

describe('webdriverio e2e - mocha, devtools and localhost', () => {
  const project = uniq('app');
  const e2eProject = project + '-e2e';
  const projectNames = names(project);

  beforeAll(async () => {
    cleanup();
    ensureNxProject('@rbnx/webdriverio', 'dist/packages/webdriverio');
    await runCommandAsync(`npm install --dev @nx/react@latest`);
    await runNxCommandAsync(
      `generate @nx/react:app ${project} --e2eTestRunner=none --linter=eslint --bundler vite`
    );
  }, 100000);

  afterAll(async () => {
    await runNxCommandAsync('reset');
  });

  it('should create an e2e project with mocha and devtools protocol', async () => {
    await runNxCommandAsync(
      `generate @rbnx/webdriverio:project ${project} --framework=mocha --protocol=devtools`
    );

    expect(() => checkFilesExist('package.json')).not.toThrow();

    const packageJson = readJson('package.json');
    expect(packageJson.devDependencies['@wdio/mocha-framework']).toBeTruthy();
    expect(packageJson.devDependencies['@wdio/jasmine-framework']).toBeFalsy();
    expect(packageJson.devDependencies['@types/jasmine']).toBeFalsy();
    expect(packageJson.devDependencies['@wdio/devtools-service']).toBeTruthy();
    expect(
      packageJson.devDependencies['@wdio/selenium-standalone-service']
    ).toBeFalsy();

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
  }, 60000);

  it('should run the e2e executor against localhost', async () => {
    const appSpecFilePath = joinPathFragments(
      'apps',
      e2eProject,
      'src',
      'e2e',
      'app.spec.ts'
    );

    expect(() => checkFilesExist(appSpecFilePath)).not.toThrow();

    updateFile(
      appSpecFilePath,
      `describe('${projectNames.className}', () => {
              it('should have the right title', async () => {
                await browser.url('/');
                await expect(browser).toHaveTitle('${projectNames.className}');
              });
            });
            `
    );

    const result = await runNxCommandAsync(
      `e2e ${e2eProject} --devServerTarget="${project}:serve:development"`
    );
    expect(result.stdout).toContain(
      `Successfully ran target e2e for project ${e2eProject}`
    );
  }, 60000);
});
