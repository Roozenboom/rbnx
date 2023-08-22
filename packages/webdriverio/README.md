<div style="display:flex; justify-content:center; align-items:center">
  <a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="100"></a>
  <a href="https://webdriver.io/">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img alt="WebdriverIO" src="https://webdriver.io/assets/images/robot-3677788dd63849c56aa5cb3f332b12d5.svg" width="80">
  </a>
</div>

# @rbnx/webdriverio

A [Nx plugin](https://nx.dev/packages/nx-plugin) that adds the [WebdriverIO](https://webdriver.io/) testing framework to a NX workspace.

## Quick Start

### Installation

First you need to add the WebdriverIO plugin to an existing NX workspace

```sh
npm install -D @rbnx/webdriverio
```

To initialize the plugin you can run a generator that will add all the required dependencies to your workspace and will create a base configuration for WebdriverIO. This step is optional and will be automatically executed when you generate your first WebdriverIO e2e project

```sh
(optional) npx nx generate @rbnx/webdriverio:init
```

### Create WebdriverIO e2e project

To generate a e2e project in your NX workspace for `your-app-name`, run the following command:

```sh
npx nx generate @rbnx/webdriverio:project your-app-name
```

It will generate a NX project with the name `your-app-name-e2e`, if this project already exists you first have to remove it:

```sh
npx nx generate remove your-app-name-e2e
```

### Running tests

You can run your e2e test by executing the command:

```sh
npx nx e2e your-app-name-e2e
```

To run a single spec file you can do:

```sh
npx nx e2e your-app-name-e2e --spec=src/e2e/app.spec.ts
```

or for a single suite:

```sh
npx nx e2e your-app-name-e2e --suite=your-suite
```

It is also possible to specify different configurations, for example to use with CI:

```sh
npx nx e2e your-app-name-e2e --configuration=ci

(alternative) npx nx run your-app-name-e2e:e2e:ci
```

## Configuration

The @rbnx/webdriverio nx plugin uses an inheritence configuration model, with a base configuration (`wdio.base.config.ts`) in the root of the NX workspace and configuration on project level (`wdio.config.ts`) that extends the base configuration. The project WebdriverIO configuration path is set in the NX project (`project.json`) e2e target options `wdioConfig` property, the target options can also be used to overwrite the base and project configuration.

```json
"targets": {
  "e2e": {
    "executor": "@rbnx/webdriverio:e2e",
    "options": {
      "wdioConfig": "wdio.config.ts"
    }
  }
},
```

For all the WebdriverIO configuration options please check the [official documentation](https://webdriver.io/docs/configurationfile) or the [example wdio config file](https://github.com/webdriverio/webdriverio/blob/main/examples/wdio.conf.js) with all possible options.

### DevServer

To automatically start the devServer before the e2e tests are executed you need to provide the configuration option `devServerTarget`.

If `devServerTarget` is provided, the url returned from the started dev server will be passed to WebdriverIO as the baseUrl option.

```json
  "targets": {
    "e2e": {
      "executor": "@rbnx/webdriverio:e2e",
      "options": {
        "devServerTarget": "your-app-name:serve:development",
      }
    }
  },
```

To skip the execution of the devServer you can overwrite this by providing the `--skipServe` flag.

### Capabilities

The @rbnx/webdriverio plugin has some predefined capabilities that can be configured with the `browsers` option in the project configuration. The predefined capabilies are:

- Chrome
- Firefox
- Microsoft Edge
- iPhone (Chrome device emulator)
- Android (Chrome device emulator)

If you want to run the tests in headless mode you can set `headless` to `true`

But you can also provide your own [capabilities](https://webdriver.io/docs/capabilities) with the `capabilities` option. For example:

```json
{
  "browserName": "chrome",
  "browserVersion": "stable"
  "goog:chromeOptions": {
    "args": ["--allow-insecure-localhost"]
  }
}
```

### Reporters

When you initialize the NX plugin you can install and configure the reporters you want to use. All official WebdriverIO reporters are supported by this NX plugin, by default it will use the spec reporter, but you can also configure other reporters like:

- [Allure Reporter](https://webdriver.io/docs/allure-reporter)
- [Concise Reporter](https://webdriver.io/docs/concise-reporter)
- [Dot Reporter](https://webdriver.io/docs/dot-reporter)
- [Junit Reporter](https://webdriver.io/docs/junit-reporter)
- [Spec Reporter](https://webdriver.io/docs/spec-reporter)

### Services

**Devtools Service**
A WebdriverIO service that allows you to use the native browser interface [DevTools](https://webdriver.io/docs/automationProtocols#devtools-protocol) as automation protocol with Puppeteer. The DevTools protocol gives you access to more automation capabilities (e.g. network interception, tracing etc.) and removes the need to manage browser drivers and versions. DevTools only supports Chromium browsers and (partially) Firefox Nightly.

## Debugging

You can enable debug mode when you run your e2e project by providing the `--debug` flag.

```sh
npx nx e2e your-app-name-e2e --spec=src/e2e/app.spec.ts --debug
```

This flag will change some of the WebdriverIO settings:

- logLevel: debug
- maxInstances: 1
- timeout: 2147483647

To activate the debug mode in your spec file you have to add

```ts
await browser.debug();
```

Read the documentation for more information about [debugging](https://webdriver.io/docs/debugging) with WebdriverIO

## That's all!

For more information about the @rbnx/webdriverio nx plugin you can run:

```sh
npx nx list @rbnx/webdriverio
```
