# VueSFCAnalyzerWebpackPlugin


![CircleCI](https://img.shields.io/circleci/project/github/indiegogo/vue-sfc-analyzer-webpack-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/vue-sfc-analyzer-webpack-plugin.svg?style=flat-square)

WebPack plugin that analyze Vue SFC `.vue` files which are loaded by vue-loader

![image](https://user-images.githubusercontent.com/21182617/37792105-1c322958-2dc8-11e8-96f5-7fd5b602448c.png)

## Requirements

- Webpack 3
  - v4 will be supported soon

## Installation

```
$ npm install -D vue-sfc-analyzer-webpack-plugin
```

or with Yarn,

```
$ yarn add -D vue-sfc-analyzer-webpack-plugin
```

Then configure your webpack config like:

```js
const path = require("path");
const VueSFCAnalyzerWebpackPlugin = require("vue-sfc-analyzer-webpack-plugin");

...

config.plugins.push(new VueSFCAnalyzerWebpackPlugin({
  showSummary: true,
  statsFilename: path.resolve(__dirname, "../analysis/vue_sfc_stats.json")
}));

...

```

## Option

```ts
new VueSFCAnalyzerWebpackPlugin(options: VueSFCAnalyzerWebpackPluginOption)
```

|Name|Type|Default|Description|
|:--|:--:|:--:|:----------|
|**`showSummary`**|`boolean`|`true`|Show summary after finishing Webpack build|
|**`statsFileName`**|`string`|`path.resolve(process.cwd(), "./vue_sfc_stats.json")`|Absolute path to dump a stats file|

## LICENSE

[MIT](LICENSE)

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
