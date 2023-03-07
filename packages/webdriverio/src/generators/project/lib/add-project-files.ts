import { createSourceFile, Node, ScriptTarget, SyntaxKind } from 'typescript';
import {
  generateFiles,
  joinPathFragments,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { capabilitiesFilter } from '../../../wdio';
import type { NormalizedSchema } from '../schema';

export function addProjectFiles(tree: Tree, options: NormalizedSchema) {
  const { autoConfig, projectRoot } = options;

  const templateOptions = {
    options,
    offsetFromRoot: offsetFromRoot(projectRoot),
    protocol: getProtocol(tree),
    wdioFrameworkType: getFrameWorkTypePackage(tree),
    wdioServiceTypes: getServiceTypePackage(tree),
    generated: '',
    tmpl: '',
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    projectRoot,
    templateOptions
  );

  if (!autoConfig) {
    if (options.browsers) {
      options.capabilities = capabilitiesFilter(options);
    }

    generateFiles(
      tree,
      joinPathFragments(__dirname, '..', '..', '..', 'wdio', 'files'),
      projectRoot,
      templateOptions
    );
  }
}

function getFrameWorkTypePackage(tree: Tree) {
  const framework = readPropertyFromConfig(tree, 'framework').shift();

  const frameworkTypePackages = new Map([
    ['mocha', '@wdio/mocha-framework'],
    ['jasmine', '@wdio/jasmine-framework'],
    ['cucumber', '@wdio/cucumber-framework'],
  ]);

  return frameworkTypePackages.get(framework) ?? '';
}

function getServiceTypePackage(tree: Tree) {
  const services = readPropertyFromConfig(tree, 'services');

  const serviceTypePackages = new Map([['devtools', '@wdio/devtools-service']]);

  return services
    .map((service) => serviceTypePackages.get(service))
    .filter(Boolean);
}

function getProtocol(tree: Tree) {
  const services = readPropertyFromConfig(tree, 'services');
  return services.includes('devtools') ? 'devtools' : 'webdriver';
}

function readPropertyFromConfig(tree: Tree, prop: string) {
  const baseConfigPath = 'wdio.base.config.ts';

  if (tree.exists(baseConfigPath)) {
    const source = createSourceFile(
      baseConfigPath,
      tree.read(baseConfigPath, 'utf-8'),
      ScriptTarget.Latest,
      true
    );

    const propNode = findNodes(source, SyntaxKind.PropertyAssignment)
      .filter((node: Node) => node.getText().startsWith(prop))
      .shift();

    return findNodes(propNode, SyntaxKind.StringLiteral).map((node) =>
      node.getText().replace(/['"]/g, '')
    );
  }
}

function findNodes(
  node: Node,
  kind: SyntaxKind | SyntaxKind[],
  max = Infinity
): Node[] {
  if (!node || max == 0) {
    return [];
  }

  const nodes: Node[] = [];
  const match = Array.isArray(kind)
    ? kind.includes(node.kind)
    : node.kind === kind;

  if (match) {
    nodes.push(node);
    max--;
  }
  if (max > 0) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach((node) => {
        if (max > 0) {
          nodes.push(node);
        }
        max--;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return nodes;
}
