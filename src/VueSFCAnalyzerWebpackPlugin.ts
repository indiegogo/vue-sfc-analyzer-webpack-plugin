import * as path from 'path';
import { Compiler } from "webpack";
const winston = require('winston');

import { sectionByPortableId, vueFilePathByPortableId } from "./webpackUtils";
import { show, total, dump } from "./stats";

const pluginName = 'VueSFCAnalyzerWebpackPlugin';

winston.configure({
  level: process.env.NODE_ENV === "test" ? "warning" : "info",
  transports: [
    new winston.transports.Console({
      colorize: true,
      showLevel: false
    })
  ]
});

export interface VueSFCAnalyzerRecord {
  template: {
    size: number;
    source: string;
  };
  script: {
    size: number;
    source: string;
  };
  style: {
    size: number,
    sources: string[];
  };
}
export interface VueSFCAnalyzerRecords {
  [filePath: string]: VueSFCAnalyzerRecord;
}

export interface VueSFCAnalyzerWebpackPluginOption {
  showSummary?: boolean;
  statsFilename?: false | string;
}

class VueSFCAnalyzerWebpackPlugin {
  records: VueSFCAnalyzerRecords;
  opts: VueSFCAnalyzerWebpackPluginOption;

  constructor (opts: VueSFCAnalyzerWebpackPluginOption = {}) {
    this.records = {};
    this.opts = {
      showSummary: false,
      statsFilename: path.resolve(process.cwd(), "./vue_sfc_stats.json"),
      ...opts
    };
  }

  apply (compiler: Compiler) {
    winston.info("WebpackVueSFCAnalyzerPlugin is Enabled");
    // console.log("compiler:", compiler);
    console.log('COMPILER');
    // compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // this.buildAssets(compilation);
    //   callback();
    // });

    compiler.hooks.run.tap(pluginName, compilation => {
        console.log("The webpack build process is starting!!!");
    });

    compiler.hooks.failed.tap(pluginName, error => {
        console.log("The webpack build process has failed!!!", error);
    });

    compiler.hooks.invalid.tap(pluginName, (fileName, changeTime) => {
        console.log("The webpack build process is invalid!!!", fileName, changeTime);
    });

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
        console.log("The webpack build emit event is thrown!!!");
        this.buildAssets(compilation);
        callback();
    });

    compiler.hooks.afterEmit.tap(pluginName, compilation => {
        console.log("The webpack build afterEmit event is thrown!!!");
    });

    compiler.hooks.afterEmit.tap(pluginName, compilation => {
        console.log("The webpack build afterEmit event is thrown!!!");
        this.buildAssets(compilation);
    });

    // compiler.hooks.done.tap(pluginName, compilation => {
    //     console.log("The webpack build done event is thrown!!!");
    //     // console.log("done - compilation:", compilation);
    //     this.buildAssets(compilation);
    // });

    compiler.hooks.done.tap(pluginName, compilation => {
        console.log("The webpack build done event is thrown!!!");
        // console.log("done - compilation:", compilation);
        // this.buildAssets(compilation);
        if (this.opts.showSummary) {
          total(this.records);
          show(this.records);
        }

        if (this.opts.statsFilename) {
          dump(this.opts.statsFilename, this.records);
        }
    });

    // compiler.hooks.emit.tap(pluginName, (compilation, callback) => {
    //   this.buildAssets(compilation);
    //   callback();
    // });

    // compiler.plugin("emit", (compilation, callback) => {
    //   console.log("compilation:", compilation);
    //   compilation.chunks.forEach((chunk) => {
    //     console.log("chunk:", chunk);
    //     chunk.forEachModule(this.recordSFCStats.bind(this));
    //   });
    //   callback();
    // });

    // compiler.plugin("done", () => {
    //
    // });
  }

  private buildAssets(compilation) {
    console.log("compilation.chunks:", compilation.chunks)
    compilation.chunks.forEach((chunk) => {
      console.log("chunk:", chunk);
      chunk.forEachModule(this.recordSFCStats.bind(this));
    });
  }

  private recordSFCStats (module) {
    const section = sectionByPortableId(module);
    if (section) {
      const filePath = vueFilePathByPortableId(module.portableId) as string;
      this.constructRecord(filePath);
      this.storeSource(filePath, module._source._value, section);
    }
  }

  private constructRecord (filePath: string) {
    if (!!this.records[filePath]) return;
    const source = "";
    const size = 0;
    this.records[filePath] = {
      template: { source, size },
      script: { source, size },
      style: { sources: [], size }
    };
  }

  private storeSource (filePath: string, source: string, section: keyof VueSFCAnalyzerRecords) {
    const size = Buffer.byteLength(source, "utf8");
    if (section === "style") {
      this.records[filePath][section].sources.push(source);
      this.records[filePath][section].size += size;
    } else {
      this.records[filePath][section] = { source, size };
    }
  }
}

export default VueSFCAnalyzerWebpackPlugin;
module.exports = VueSFCAnalyzerWebpackPlugin; //CJS
module.exports.default = module.exports; // ES6
