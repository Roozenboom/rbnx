import type { Schema } from '../schema';

export function normalizeOptions(options: Schema): Schema {
  return {
    runner: 'local',
    framework: 'jasmine',
    reporters: ['spec'],
    services: [
      ...(options.services ?? []),
      options.protocol === 'devtools' ? 'devtools' : 'selenium-standalone',
    ],
    protocol: options.protocol ?? 'webdriver',
    skipFormat: false,
    ...options,
  };
}
