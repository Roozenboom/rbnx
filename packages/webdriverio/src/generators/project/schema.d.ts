import type { BrowserName, WdioOptions } from '../../wdio';

export interface Schema extends WdioOptions {
  project: string;
  tags?: string;
  browsers?: BrowserName[];
  wdioConfig?: string;
  autoConfig?: boolean;
  skipFormat?: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
