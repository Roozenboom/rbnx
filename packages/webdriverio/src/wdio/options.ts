import { Capability, BrowserName } from './capabilities';

export type Runner = 'local';
export type Protocol = 'webdriver' | 'devtools';
export type Framework = 'mocha' | 'jasmine';
export type Reporters = 'allure' | 'spec' | 'dot' | 'junit' | 'concise';
export type Services = 'devtools';
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface WdioOptions {
  specs?: string[];
  exclude?: string[];
  suites?: Record<string, string[]>;
  maxInstances?: number;
  maxInstancesPerCapability?: number;
  browsers?: BrowserName[];
  capabilities?: Capability[];
  headless?: boolean;
  logLevel?: LogLevel;
  outputDir?: string;
  bail?: number;
  baseUrl?: string;
  hostname?: string;
  port?: number;
  path?: string;
  waitforTimeout?: number;
  framework?: Framework;
  protocol?: Protocol;
  reporters?: Reporters[];
  services?: Services[];
  specFileRetries?: number;
  specFileRetriesDelay?: number;
  specFileRetriesDeferred?: boolean;
  filesToWatch?: string;
}

type wdioOptsKeys = keyof WdioOptions;

const wdioOpts: wdioOptsKeys[] = ['browsers', 'headless', 'protocol'];

export function filterWdioOptions(obj): WdioOptions {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]: [wdioOptsKeys, unknown]) =>
      wdioOpts.includes(key),
    ),
  );
}
