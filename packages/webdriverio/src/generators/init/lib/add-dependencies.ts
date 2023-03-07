import { Tree, addDependenciesToPackageJson } from '@nrwl/devkit';
import type { Schema } from '../schema';

type Package = {
  name: string;
  version: string;
};

const wdioVersion = '^8.3.0';
const jasmineTypesVersion = '^4.3.1';
const tsNodeVersion = '10.9.1';

const packages = new Map<string, Package>([
  ['cli', { name: '@wdio/cli', version: wdioVersion }],
  ['globals', { name: '@wdio/globals', version: wdioVersion }],
  ['types', { name: '@wdio/types', version: wdioVersion }],
  ['ts-node', { name: 'ts-node', version: tsNodeVersion }],
  // Runners
  ['local', { name: '@wdio/local-runner', version: wdioVersion }],
  // Frameworks
  ['mocha', { name: '@wdio/mocha-framework', version: wdioVersion }],
  ['jasmine', { name: '@wdio/jasmine-framework', version: wdioVersion }],
  ['jasmine-types', { name: '@types/jasmine', version: jasmineTypesVersion }],
  // Reporters
  ['allure', { name: '@wdio/allure-reporter', version: wdioVersion }],
  ['concise', { name: '@wdio/concise-reporter', version: wdioVersion }],
  ['dot', { name: '@wdio/dot-reporter', version: wdioVersion }],
  ['junit', { name: '@wdio/junit-reporter', version: wdioVersion }],
  ['spec', { name: '@wdio/spec-reporter', version: wdioVersion }],
  // Services
  ['devtools', { name: '@wdio/devtools-service', version: wdioVersion }],
  [
    'selenium-standalone',
    { name: '@wdio/selenium-standalone-service', version: wdioVersion },
  ],
]);

export function addDependencies(tree: Tree, options: Schema) {
  const packagesToInstall: Package[] = [];
  if (packages.has(options.runner)) {
    packagesToInstall.push(packages.get(options.runner));
  }

  if (packages.has(options.framework)) {
    packagesToInstall.push(packages.get(options.framework));
    if (options.framework === 'jasmine') {
      packagesToInstall.push(packages.get('jasmine-types'));
    }
  }

  for (const reporter of options.reporters) {
    if (packages.has(reporter)) {
      packagesToInstall.push(packages.get(reporter));
    }
  }

  for (const service of options.services) {
    if (packages.has(service)) {
      packagesToInstall.push(packages.get(service));
    }
  }

  const devDependencies = {
    [packages.get('cli')['name']]: packages.get('cli')['version'],
    [packages.get('globals')['name']]: packages.get('globals')['version'],
    [packages.get('types')['name']]: packages.get('types')['version'],
    [packages.get('ts-node')['name']]: packages.get('ts-node')['version'],
  };
  packagesToInstall.forEach((pkg) => (devDependencies[pkg.name] = pkg.version));
  return addDependenciesToPackageJson(tree, {}, devDependencies);
}
