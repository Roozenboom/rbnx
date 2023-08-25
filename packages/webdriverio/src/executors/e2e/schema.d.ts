import type { BrowserName, WdioOptions } from '../../wdio';

export interface Schema extends WdioOptions {
  spec?: string;
  suite?: string;
  browsers?: BrowserName[];
  wdioConfig?: string;
  devServerTarget?: string;
  skipServe?: boolean;
  watch?: boolean;
  debug?: boolean;
}

export interface NormalizedSchema extends Schema {
  configPath: string;
  baseConfigModuleName: string;
  baseConfigPath: string;
  isVerbose: boolean;
  projectName: string;
  projectRoot: string;
  timeout: number;
}
