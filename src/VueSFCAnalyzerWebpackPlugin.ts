import { Compiler } from "webpack";
import chalk from "chalk";
import * as path from 'path';
import * as fs from 'fs';
import * as mkdir from "mkdirp";

const SECTION_TEMPLATE = "template";
const SECTION_SCRIPT = "script";
const SECTION_STYLE = "style";

type VueSFCAnalyzerSectionName = "template" | "script" | "style";

export interface VueSFCAnalyzerRecord {
  [filePath: string]: {
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
  };
}
export interface VueSFCAnalyzerWebpackPluginOption {
  showSummary?: boolean;
  statsFilename?: false | string;
}

class VueSFCAnalyzerWebpackPlugin {
  records: VueSFCAnalyzerRecord;
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
        chunk.forEachModule((module) => {
          const { portableId } = module;
          const vueFile = portableId.match(/([\w\-/]+\.vue)$/);
          if (vueFile) {
            const filePath = vueFile[1];
            this.constructRecord(filePath);
            const section = this.getSectionByPortableId(portableId);
            if (section) {
              this.storeSource(filePath, module._source._value, section);
            }
          }
        });
      });
      callback();
    });

    compiler.plugin("done", () => {
      if (this.opts.showSummary) {
        const whole = {
          [SECTION_TEMPLATE]: 0,
          [SECTION_SCRIPT]: 0,
          [SECTION_STYLE]: 0
        };
        Object.keys(this.records).forEach((filePath) => {
          const templateSize = this.records[filePath][SECTION_TEMPLATE].size;
          const scriptSize = this.records[filePath][SECTION_SCRIPT].size;
          const styleSize = this.records[filePath][SECTION_STYLE].size;
          const total = templateSize + scriptSize + styleSize;
          whole[SECTION_TEMPLATE] += templateSize;
          whole[SECTION_SCRIPT] += scriptSize;
          whole[SECTION_STYLE] += styleSize;

          console.log(chalk.underline(chalk.green(`[Compiled] ${filePath}:`)));
          console.log(`  ${chalk.redBright("<template>")}: ${templateSize} bytes (${Math.round(templateSize / total * 100)}%)`);
          console.log(`  ${chalk.blueBright("<script>")}  : ${scriptSize} bytes (${Math.round(scriptSize / total * 100)}%)`);
          console.log(`  ${chalk.magentaBright("<style>")}   : ${styleSize} bytes (${Math.round(styleSize / total * 100)}%)`);
        });
        const wholeTotal = whole[SECTION_TEMPLATE] + whole[SECTION_SCRIPT] + whole[SECTION_STYLE];
        console.log(chalk.underline("Total all of .vue file:"));
        console.log(`  ${chalk.redBright("<template>")}: ${whole[SECTION_TEMPLATE]} bytes (${Math.round(whole[SECTION_TEMPLATE] / wholeTotal * 100)}%)`);
        console.log(`  ${chalk.blueBright("<script>")}  : ${whole[SECTION_SCRIPT]} bytes (${Math.round(whole[SECTION_SCRIPT] / wholeTotal * 100)}%)`);
        console.log(`  ${chalk.magentaBright("<style>")}   : ${whole[SECTION_STYLE]} bytes (${Math.round(whole[SECTION_STYLE] / wholeTotal * 100)}%)`);
      }

      if (this.opts.statsFilename) {
        mkdir.sync(path.dirname(this.opts.statsFilename));
        fs.writeFileSync(this.opts.statsFilename, JSON.stringify(this.records));
        console.log(chalk.bold(`WebpackVueSFCAnalyzerPlugin saved stats file to ${this.opts.statsFilename}`));
      }
    });
  }

  private constructRecord (filePath: string) {
    if (!!this.records[filePath]) return;
    const source = "";
    const size = 0;
    this.records[filePath] = {
      [SECTION_TEMPLATE]: { source, size },
      [SECTION_SCRIPT]: { source, size },
      [SECTION_STYLE]: { sources: [], size }
    };
  }

  private getSectionByPortableId (portableId: string): VueSFCAnalyzerSectionName | undefined {
    // Should parse loader ideally, and not support pure JS of <script> yet
    if (portableId.match(/^node_modules\/vue-loader\/lib\/template-compiler\//)) {
      return SECTION_TEMPLATE;
    } else if (portableId.match(/^node_modules\/ts-loader\/index\.js/)) {
      return SECTION_SCRIPT;
    } else if (
      portableId.match(/^node_modules\/vue-style-loader\/index\.js/) ||
      portableId.match(/^node_modules\/css-loader\/index\.js/)
    ) {
      return SECTION_STYLE;
    }
  }

  private storeSource (filePath: string, source: string, section: VueSFCAnalyzerSectionName) {
    const size = Buffer.byteLength(source, "utf8");
    if (section === SECTION_STYLE) {
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
