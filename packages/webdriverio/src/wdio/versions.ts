export type Package = {
  name: string;
  version: string;
};

const wdioVersion = '^8.8.0';
const jasmineTypesVersion = '^4.3.1';
const tsNodeVersion = '10.9.1';

export const packages = new Map<string, Package>([
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
