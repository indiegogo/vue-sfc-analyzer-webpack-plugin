const { underline, bold, green, redBright, blueBright, magentaBright } = require("chalk");
const path = require("path");
const fs = require("fs");
const mkdir = require("mkdirp");

const SECTION_TEMPLATE = "template";
const SECTION_SCRIPT = "script";
const SECTION_STYLE = "style";

export class WebpackVueSFCAnalyzerPlugin {
  constructor (opts = {}) {
    /*
    {
      [Path for .vue file]: {
        template: {
          size: Size of template section,
          source: "Raw code of compiled <template>"
        },
        script: {
          size: Size of script section,
          source: "Raw code of compiled <script>"
        },
        style: {
          size: Total size of style section
          sources: [
            "Raw code of compiled <style>"
          ]
        }
      }
    }
    */
    this.records = {};
    this.opts = {
      showSummary: opts.showSummary,
      statsFilename: opts.statsFilename || path.resolve(process.cwd(), "./vue_sfc_stats.json")
      // ...opts
    };
  }

  apply (compiler) {
    console.log("WebpackVueSFCAnalyzerPlugin is Enabled");
    compiler.plugin("emit", (compilation, callback) => {
      compilation.chunks.forEach((chunk) => {
        chunk.forEachModule((module) => {
          const { portableId } = module;
          const vueFile = portableId.match(/([\w\-/]+\.vue)$/);
          if (vueFile) {
            const filePath = vueFile[1];
            this.constructRecord(filePath);
            this.storeSource(filePath, module._source._value, this.getSectionByPortableId(portableId)); // eslint-disable-line no-underscore-dangle
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

          console.log(underline(green(`[Compiled] ${filePath}:`)));
          console.log(`  ${redBright("<template>")}: ${templateSize} bytes (${Math.round(templateSize / total * 100, -1)}%)`);
          console.log(`  ${blueBright("<script>")}  : ${scriptSize} bytes (${Math.round(scriptSize / total * 100, -1)}%)`);
          console.log(`  ${magentaBright("<style>")}   : ${styleSize} bytes (${Math.round(styleSize / total * 100, -1)}%)`);
        });
        const wholeTotal = whole[SECTION_TEMPLATE] + whole[SECTION_SCRIPT] + whole[SECTION_STYLE];
        console.log(underline("Total all of .vue file:"));
        console.log(`  ${redBright("<template>")}: ${whole[SECTION_TEMPLATE]} bytes (${Math.round(whole[SECTION_TEMPLATE] / wholeTotal * 100, -1)}%)`);
        console.log(`  ${blueBright("<script>")}  : ${whole[SECTION_SCRIPT]} bytes (${Math.round(whole[SECTION_SCRIPT] / wholeTotal * 100, -1)}%)`);
        console.log(`  ${magentaBright("<style>")}   : ${whole[SECTION_STYLE]} bytes (${Math.round(whole[SECTION_STYLE] / wholeTotal * 100, -1)}%)`);
      }

      mkdir.sync(path.dirname(this.opts.statsFilename));
      fs.writeFileSync(this.opts.statsFilename, JSON.stringify(this.records));
      console.log(bold(`WebpackVueSFCAnalyzerPlugin saved stats file to ${this.opts.statsFilename}`));
    });
  }

  constructRecord (filePath) {
    if (!!this.records[filePath]) return;
    const source = "";
    const size = 0;
    this.records[filePath] = {
      [SECTION_TEMPLATE]: { source, size },
      [SECTION_SCRIPT]: { source, size },
      [SECTION_STYLE]: { sources: [], size }
    };
  }

  getSectionByPortableId (portableId) {
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

  storeSource (filePath, source, section) {
    const size = Buffer.byteLength(source, "utf8");
    if (section === SECTION_STYLE) {
      this.records[filePath][section].sources.push(source);
      this.records[filePath][section].size = size;
    } else {
      this.records[filePath][section] = { source, size };
    }
  }
}
