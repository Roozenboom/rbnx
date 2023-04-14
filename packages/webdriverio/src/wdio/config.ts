import { Tree } from '@nrwl/devkit';
import { createSourceFile, Node, ScriptTarget, SyntaxKind } from 'typescript';

export function readPropertyFromConfig<T = string>(
  tree: Tree,
  config: string,
  prop: string
) {
  if (tree.exists(config)) {
    const source = createSourceFile(
      config,
      tree.read(config, 'utf-8'),
      ScriptTarget.Latest,
      true
    );

    const propNode = findNodes(source, SyntaxKind.PropertyAssignment)
      .filter((node: Node) => node.getText().startsWith(prop))
      .shift();

    return findNodes(propNode, SyntaxKind.StringLiteral).map<T>(
      (node) => node.getText().replace(/['"]/g, '') as T
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
