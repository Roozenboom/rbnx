import { Tree, addDependenciesToPackageJson } from '@nx/devkit';
import { Package, packages } from '../../../wdio/versions';
import type { Schema } from '../schema';

export function addDependencies(tree: Tree, options: Schema) {
  const packagesToInstall: Package[] = [];
  if (packages.has(options.runner)) {
    packagesToInstall.push(packages.get(options.runner));
  }

  if (packages.has(options.framework)) {
    packagesToInstall.push(packages.get(options.framework));
    if (options.framework === 'jasmine') {
      packagesToInstall.push(packages.get('jasmine-types'));
    }
  }

  if (options.reporters) {
    for (const reporter of options.reporters) {
      if (packages.has(reporter)) {
        packagesToInstall.push(packages.get(reporter));
      }
    }
  }

  if (options.services) {
    for (const service of options.services) {
      if (packages.has(service)) {
        packagesToInstall.push(packages.get(service));
      }
    }
  }

  const devDependencies = {
    [packages.get('cli')['name']]: packages.get('cli')['version'],
    [packages.get('globals')['name']]: packages.get('globals')['version'],
    [packages.get('types')['name']]: packages.get('types')['version'],
    [packages.get('ts-node')['name']]: packages.get('ts-node')['version'],
  };
  packagesToInstall.forEach((pkg) => (devDependencies[pkg.name] = pkg.version));
  return addDependenciesToPackageJson(tree, {}, devDependencies);
}
