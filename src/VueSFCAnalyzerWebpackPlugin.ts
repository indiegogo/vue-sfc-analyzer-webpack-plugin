import { Compiler } from "webpack";
import chalk from "chalk";
import * as path from 'path';
import * as fs from 'fs';
import * as mkdir from "mkdirp";

export const enum SFCSection {
  Template = "template",
  Script = "script",
  Style = "style"
};

export interface VueSFCAnalyzerRecords {
  [filePath: string]: {
    [SFCSection.Template]: {
      size: number;
      source: string;
    };
    [SFCSection.Script]: {
      size: number;
      source: string;
    };
    [SFCSection.Style]: {
      size: number,
      sources: string[];
    };
  };
}
export interface VueSFCAnalyzerWebpackPluginOption {
  showSummary?: boolean;
  statsFilename?: false | string;
}

const sectionByPortableId = (portableId: string): SFCSection | undefined => {
  // Should parse loader ideally, and not support pure JS of <script> yet
  if (portableId.match(/^node_modules\/vue-loader\/lib\/template-compiler\//)) {
    return SFCSection.Template;
  } else if (portableId.match(/^node_modules\/ts-loader\/index\.js/)) {
    return SFCSection.Script;
  } else if (
    portableId.match(/^node_modules\/vue-style-loader\/index\.js/) ||
    portableId.match(/^node_modules\/css-loader\/index\.js/)
  ) {
    return SFCSection.Style;
  }
}

const dumpStatsFile = (filePath: string, records: VueSFCAnalyzerRecords) => {
  mkdir.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(records));
  console.log(chalk.bold(`WebpackVueSFCAnalyzerPlugin saved stats file to ${filePath}`));
};

const showSummaryOfStats = (records: VueSFCAnalyzerRecords) => {
  const whole = {
    [SFCSection.Template]: 0,
    [SFCSection.Script]: 0,
    [SFCSection.Style]: 0
  };
  Object.keys(records).forEach((filePath) => {
    const templateSize = records[filePath][SFCSection.Template].size;
    const scriptSize = records[filePath][SFCSection.Script].size;
    const styleSize = records[filePath][SFCSection.Style].size;
    const total = templateSize + scriptSize + styleSize;
    whole[SFCSection.Template] += templateSize;
    whole[SFCSection.Script] += scriptSize;
    whole[SFCSection.Style] += styleSize;

    console.log(chalk.underline(chalk.green(`[Compiled] ${filePath}:`)));
    console.log(`  ${chalk.redBright("<template>")}: ${templateSize} bytes (${Math.round(templateSize / total * 100)}%)`);
    console.log(`  ${chalk.blueBright("<script>")}  : ${scriptSize} bytes (${Math.round(scriptSize / total * 100)}%)`);
    console.log(`  ${chalk.magentaBright("<style>")}   : ${styleSize} bytes (${Math.round(styleSize / total * 100)}%)`);
  });
  const wholeTotal = whole[SFCSection.Template] + whole[SFCSection.Script] + whole[SFCSection.Style];
  console.log(chalk.underline("Total all of .vue file:"));
  console.log(`  ${chalk.redBright("<template>")}: ${whole[SFCSection.Template]} bytes (${Math.round(whole[SFCSection.Template] / wholeTotal * 100)}%)`);
  console.log(`  ${chalk.blueBright("<script>")}  : ${whole[SFCSection.Script]} bytes (${Math.round(whole[SFCSection.Script] / wholeTotal * 100)}%)`);
  console.log(`  ${chalk.magentaBright("<style>")}   : ${whole[SFCSection.Style]} bytes (${Math.round(whole[SFCSection.Style] / wholeTotal * 100)}%)`);
};

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
    console.log("WebpackVueSFCAnalyzerPlugin is Enabled");
    compiler.plugin("emit", (compilation, callback) => {
      compilation.chunks.forEach((chunk) => {
        chunk.forEachModule(this.recordSFCStats.bind(this));
      });
      callback();
    });

    compiler.plugin("done", () => {
      if (this.opts.showSummary) {
        showSummaryOfStats(this.records);
      }

      if (this.opts.statsFilename) {
        dumpStatsFile(this.opts.statsFilename, this.records);
      }
    });
  }

  private recordSFCStats (module) {
    const { portableId } = module;
    const vueFile = portableId.match(/([\w\-_/]+\.vue)$/);
    if (vueFile) {
      const filePath = vueFile[1];
      this.constructRecord(filePath);
      const section = sectionByPortableId(portableId);
      if (section) {
        this.storeSource(filePath, module._source._value, section);
      }
    }
  }

  private constructRecord (filePath: string) {
    if (!!this.records[filePath]) return;
    const source = "";
    const size = 0;
    this.records[filePath] = {
      [SFCSection.Template]: { source, size },
      [SFCSection.Script]: { source, size },
      [SFCSection.Style]: { sources: [], size }
    };
  }

  private storeSource (filePath: string, source: string, section: SFCSection) {
    const size = Buffer.byteLength(source, "utf8");
    if (section === SFCSection.Style) {
      this.records[filePath][section].sources.push(source);
      this.records[filePath][section].size = size;
    } else {
      this.records[filePath][section] = { source, size };
    }
  }
}

export default VueSFCAnalyzerWebpackPlugin;
module.exports = VueSFCAnalyzerWebpackPlugin; //CJS
module.exports.default = module.exports; // ES6
