import {
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { capabilitiesFilter, readPropertyFromConfig } from '../../../wdio';
import type { NormalizedSchema } from '../schema';

export function addProjectFiles(tree: Tree, options: NormalizedSchema) {
  const { projectRoot } = options;

  const framework =
    options.framework ??
    readPropertyFromConfig(tree, 'wdio.base.config.ts', 'framework').shift();
  const services = [
    ...new Set([
      ...(options.services ?? []),
      ...readPropertyFromConfig(tree, 'wdio.base.config.ts', 'services'),
    ]),
  ];

  const templateOptions = {
    options,
    framework,
    protocol: options.protocol ?? getProtocol(services),
    wdioFrameworkType: getFrameWorkTypePackage(framework),
    wdioServiceTypes: getServiceTypePackage(services),
    offsetFromRoot: offsetFromRoot(projectRoot),
    tmpl: '',
  };

  if (options.browsers) {
    options.capabilities = capabilitiesFilter(options);
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    projectRoot,
    templateOptions,
  );
}

function getFrameWorkTypePackage(framework: string) {
  const frameworkTypePackages = new Map([
    ['mocha', '@wdio/mocha-framework'],
    ['jasmine', '@wdio/jasmine-framework'],
    ['cucumber', '@wdio/cucumber-framework'],
  ]);

  return frameworkTypePackages.get(framework) ?? '';
}

function getServiceTypePackage(services: string[]) {
  const serviceTypePackages = new Map([['devtools', '@wdio/devtools-service']]);

  return services
    .map((service) => serviceTypePackages.get(service))
    .filter(Boolean);
}

function getProtocol(services: string[]) {
  return services.includes('devtools') ? 'devtools' : 'webdriver';
}
