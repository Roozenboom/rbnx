import { WdioOptions } from './options';

export type BrowserName = 'chrome' | 'firefox' | 'edge' | 'android' | 'iphone';

export interface Capability {
  browserName: BrowserName | 'MicrosoftEdge';
  acceptInsecureCerts?: boolean;
  [key: string]: string | boolean | CapabilityOptions;
}

interface CapabilityOptions {
  args?: string[];
  mobileEmulation?: {
    deviceName: string;
  };
}

const capabilities = (headless: boolean) =>
  new Map<BrowserName, Capability>([
    [
      'chrome',
      {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
          args: headless ? ['headless', 'disable-gpu'] : [],
        },
      },
    ],
    [
      'firefox',
      {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: headless ? ['-headless'] : [],
        },
      },
    ],
    [
      'edge',
      {
        browserName: 'MicrosoftEdge',
        'ms:edgeOptions': {
          args: headless ? ['--headless'] : [],
        },
      },
    ],
    [
      'android',
      {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
          mobileEmulation: {
            deviceName: 'Pixel 5',
          },
        },
      },
    ],
    [
      'iphone',
      {
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
          mobileEmulation: {
            deviceName: 'iPhone 12 Pro',
          },
        },
      },
    ],
  ]);

const getBrowserCapabilities = ({
  browsers,
  headless,
}: WdioOptions): Capability[] =>
  browsers
    .map((capability) => capabilities(headless).get(capability))
    .filter(Boolean);

const uniqueCapabilities = (caps: Capability[]): Capability[] =>
  [...new Set(caps.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s));

export function capabilitiesFilter({
  browsers,
  capabilities = [],
  headless = false,
}: WdioOptions): Capability[] {
  return uniqueCapabilities([
    ...capabilities,
    ...getBrowserCapabilities({ browsers, headless }),
  ]);
}
