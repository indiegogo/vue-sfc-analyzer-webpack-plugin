import * as path from 'path';
import { Compiler } from "webpack";
import winston from "winston";

import { sectionByPortableId, vueFilePathByPortableId } from "./webpackUtils";
import { show, dump } from "./stats";

winston.level = process.env.NODE_ENV === "test" ? "warning" : "info";

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
    compiler.plugin("emit", (compilation, callback) => {
      compilation.chunks.forEach((chunk) => {
        chunk.forEachModule(this.recordSFCStats.bind(this));
      });
      callback();
    });

    compiler.plugin("done", () => {
      if (this.opts.showSummary) {
        show(this.records);
      }

      if (this.opts.statsFilename) {
        dump(this.opts.statsFilename, this.records);
      }
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
