import type { BrowserName, WdioOptions } from '../../wdio';

export interface Schema extends WdioOptions {
  spec?: string;
  suite?: string;
  browsers?: BrowserName[];
  wdioConfig?: string;
  devServerTarget?: string;
  skipServe?: boolean;
}

export interface NormalizedSchema extends Schema {
  configFile: string;
  configPath: string;
  isVerbose: boolean;
  projectName: string;
  projectRoot: string;
}
