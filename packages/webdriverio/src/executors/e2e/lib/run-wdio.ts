import {
  formatFiles,
  generateFiles,
  getPackageManagerCommand,
  joinPathFragments,
  Tree,
  workspaceRoot,
} from '@nrwl/devkit';
import { flushChanges, FsTree } from 'nx/src/generators/tree';
import { exec } from 'node:child_process';
import { unlink } from 'node:fs/promises';
import type { NormalizedSchema } from '../schema';

export async function runWdio(options: NormalizedSchema) {
  const { projectRoot, configFile, spec, suite, watch } = options;

  let command = `${getPackageManagerCommand().exec} wdio ${configFile}`;
  if (spec) command += ` --spec=${spec}`;
  if (suite) command += ` --suite=${suite}`;
  if (watch) command += ` --watch`;

  await new Promise((resolve, reject) => {
    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
      error ? reject(error) : resolve({ stdout, stderr });
    }).stdout.pipe(process.stdout);

    if (watch) {
      process.on('SIGINT', () => resolve({}));
      process.on('SIGTERM', () => resolve({}));
    }
  });
}

export async function generateWdioConfig(options: NormalizedSchema) {
  const { projectRoot } = options;

  const tree: Tree = new FsTree(workspaceRoot, false);
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    projectRoot,
    {
      tmpl: '',
      options,
    }
  );
  await formatFiles(tree);
  flushChanges(workspaceRoot, tree.listChanges());
}

export async function unlinkWdioConfig(options: NormalizedSchema) {
  const { configPath, isVerbose } = options;
  try {
    await unlink(configPath);
  } catch (error) {
    if (isVerbose) console.error(error);
  }
}
