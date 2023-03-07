# Contributing guidelines

## Issues and feature requests

You've found a bug in the source code, a mistake in the documentation or maybe you'd like a new feature? You can help us by [submitting an issue on GitHub](https://github.com/roozenboom/rbnx/issues). Before you submit an issue, please search the issue tracker and take a look at [GitHub Discussions](https://github.com/roozenboom/rbnx/discussions). An issue for your problem may already exist and has been resolved, or the discussion might inform you of workarounds readily available.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

Even better: Submit a pull request with a fix or new feature!

### How to submit a Pull Request

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request).

Please follow the following guidelines:

- Make sure unit tests pass (`npx nx affected --target=test`)
  - Target a specific project with: `npx nx run proj:test` (i.e. `npx nx run webdriverio:test` to target `packages/webdriverio`)
  - Target a specific unit test file (i.e. `packages/webdriverio/src/generators/project/generator.spec.ts`)
    with `npx nx run webdriverio:test --testFile generators/project/generator.spec.ts`
  - For more options on running tests - check `npx jest --help` or visit [jestjs.io](https://jestjs.io/)
- Make sure e2e tests pass (this can take a while, so you can always let CI check those) (`npx nx affected --target=e2e`)
  - Target a specific e2e test with `npx nx e2e webdriverio-e2e`
- Make sure you run `nx format`
- Update your commit message to follow the guidelines below. We use commitlint to enforce compliance.
  - `npx commitlint -eV` will check to make sure your commit messages are formatted correctly

#### Commit Message Guidelines

The commit message should follow the following format:

```plain
type(scope): subject
BLANK LINE
body
```

##### Type

The type must be one of the following:

- feat - New or improved behavior being introduced
- fix - Fixes the current unexpected behavior to match expected behavior
- docs - Changes to the documentation
- chore - Changes that have absolutely no effect on users

##### Scope

The scope is optional and can be for example the package:

- core
- e2e
- wdio

##### Subject and Body

The subject must contain a description of the change, and the body of the message contains any additional details to provide more context about the change.

Including the issue number that the PR relates to also helps with tracking.

#### Example

```plain
feat(webdriverio): add an option to debug

`nx e2e my-app --debug` will increase the timeout to easily debug e2e tests

Closes #42
```
