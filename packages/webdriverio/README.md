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

The @rbnx/webdriverio nx plugin supports two configuration methods, the default configuration option uses the options object in the `project.json` file and will generate the wdio config file when you run the tests.
An alternative method is to only specify the path to the configuration file in the project.json with the `wdioConfig` property. In this case it will not generate a config file but will use the one specified.

**NOTE:** For creating a WebdriverIO e2e project with configuration file you can set the flag `auto-config` to `false`

```sh
npx nx generate @rbnx/webdriverio:project your-app-name --no-auto-config
```

Regardless of whether you choose configuration via project.json or wdio config, you can use all standard WebdriverIO configuration options.

For all the WebdriverIO configuration options please check the [official documentation](https://webdriver.io/docs/configurationfile) or the [example wdio config file](https://github.com/webdriverio/webdriverio/blob/main/examples/wdio.conf.js) with all possible options.

### Capabilities

The @rbnx/webdriverio plugin has some predefined capabilities that can be configured with the `browsers` option. The predefined capabilies are:

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

**Selenium Standalone Service**
Handling the Selenium server is out of the scope of the actual WebdriverIO project. This service helps you to run Selenium seamlessly when running tests with the WDIO testrunner. It uses the well-known selenium-standalone NPM package that automatically sets up the standalone server and all required drivers for you.

## That's all!

For more information about the @rbnx/webdriverio nx plugin you can run:

```sh
npx nx list @rbnx/webdriverio
```
