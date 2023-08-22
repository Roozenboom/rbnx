import type { Schema } from '../schema';

export function normalizeOptions(options: Schema): Schema {
  return {
    runner: 'local',
    framework: 'jasmine',
    reporters: ['spec'],
    services:
      options.protocol === 'devtools'
        ? [...(options.services ?? []), 'devtools']
        : [...(options.services ?? [])],
    protocol: options.protocol ?? 'webdriver',
    skipFormat: false,
    ...options,
  };
}
