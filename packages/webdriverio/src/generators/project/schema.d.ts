import type { BrowserName, Protocol, WdioOptions } from '../../wdio';

export interface Schema extends WdioOptions {
  project: string;
  tags?: string;
  browsers?: BrowserName[];
  protocol?: Protocol;
  wdioConfig?: string;
  skipFormat?: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}
