import {
  formatFiles,
  generateFiles,
  getPackageManagerCommand,
  joinPathFragments,
  offsetFromRoot,
  Tree,
  workspaceRoot,
} from '@nrwl/devkit';
import { flushChanges, FsTree } from 'nx/src/generators/tree';
import { exec } from 'node:child_process';
import { unlink } from 'node:fs/promises';
import { capabilitiesFilter } from '../../../wdio';
import type { NormalizedSchema } from '../schema';

export async function runWdio(options: NormalizedSchema) {
  const { projectRoot, configFile, spec, suite } = options;

  let command = `${getPackageManagerCommand().exec} wdio ${configFile}`;
  if (spec) command += ` --spec=${spec}`;
  if (suite) command += ` --suite=${suite}`;

  await new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
      error ? reject(error) : resolve({ stdout, stderr });
    }).stdout.pipe(process.stdout);
  });
}

export async function generateWdioConfig(options: NormalizedSchema) {
  const { wdioConfig, browsers, projectRoot } = options;

  if (wdioConfig) return;

  if (browsers) {
    options.capabilities = capabilitiesFilter(options);
  }

  const tree: Tree = new FsTree(workspaceRoot, false);
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', '..', '..', 'wdio', 'files'),
    projectRoot,
    {
      tmpl: '',
      generated: '.generated',
      offsetFromRoot: offsetFromRoot(projectRoot),
      options,
    }
  );
  await formatFiles(tree);
  flushChanges(workspaceRoot, tree.listChanges());
}

export async function unlinkWdioConfig(options: NormalizedSchema) {
  const { configPath, isVerbose, wdioConfig } = options;

  if (wdioConfig) return;
  try {
    await unlink(configPath);
  } catch (error) {
    if (isVerbose) console.error(error);
  }
}
