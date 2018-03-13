import Plugin, { VueSFCAnalyzerWebpackPluginOption } from "../src/VueSFCAnalyzerWebpackPlugin";
import webpack from "webpack";
import path from "path";
import fs from "fs";

describe("VueSFCAnalyzerWebpackPlugin", () => {
  describe("options", () => {
    const optionsOfConstructWith = (option: VueSFCAnalyzerWebpackPluginOption): VueSFCAnalyzerWebpackPluginOption => {
      return new Plugin(option).opts;
    };

    it("as default", () => {
      const opts = optionsOfConstructWith({});
      expect(opts).toEqual({
        showSummary: false,
        statsFilename: `${process.cwd()}/vue_sfc_stats.json`
      });
    });

    it("showSummary should be configurable", () => {
      const opts = optionsOfConstructWith({
        showSummary: true
      });
      expect(opts.showSummary).toBe(true);
    });

    it("statsFilename should be configurable", () => {
      const opts = optionsOfConstructWith({
        statsFilename: "/somewhere"
      });
      expect(opts.statsFilename).toEqual("/somewhere");
    });

    it("statsFilename could be false", () => {
      const opts = optionsOfConstructWith({
        statsFilename: false
      });
      expect(opts.statsFilename).toBe(false);
    });
  });
});

describe("with Webpack", () => {
  const defaultStatsPath = path.resolve(process.cwd(), "./vue_sfc_stats.json");
  const customPath = path.resolve(process.cwd(), "./vue_sfc_stats_custom.json");
  const fileExists = (path): boolean => fs.existsSync(path);

  afterEach(() => {
    // Clean up files which may exist
    [defaultStatsPath, customPath].forEach((path) => {
      if (fileExists(path)) {
        fs.unlinkSync(path);
      }
    });
  });

  jest.setTimeout(10000);

  const webpackOption = (plugin) => {
    return {
      entry: {
        app: path.resolve(__dirname, "./fixtures/source.ts")
      },
      output: {
        path: path.resolve(__dirname, "./fixtures"),
        filename: "output.js"
      },
      plugins: [plugin],
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: "vue-loader"
          },
          {
            test: /\.ts$/,
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          },
        ]
      },
      resolve: {
        extensions: [".ts", ".js", ".vue"]
      }
    }
  };

  describe("analysis result", () => {
    let plugin;

    const recordFor = (sfcFileName) => {
      return plugin.records[`test/fixtures/${sfcFileName}`];
    };

    beforeEach(() => {
      plugin = new Plugin({
        statsFilename: false
      });
    });

    it("should record result of the basic component (TestComponent.vue)", (done) => {
      webpack(webpackOption(plugin)).run((err, stats) => {
        const record = recordFor("TestComponent.vue");
        expect(record.template.size).toBeGreaterThan(0);
        expect(record.template.source.length).toBeGreaterThan(0);
        expect(record.script.size).toBeGreaterThan(0);
        expect(record.script.source.length).toBeGreaterThan(0);
        expect(record.style.size).toBeGreaterThan(0);
        expect(record.style.sources.length).toBe(2);
        done();
      });
    });

    it("should record result of the component without style section (TestComponentWithoutStyle.vue)", (done) => {
      webpack(webpackOption(plugin)).run((err, stats) => {
        const record = recordFor("TestComponentWithoutStyle.vue");
        expect(record.template.size).toBeGreaterThan(0);
        expect(record.template.source.length).toBeGreaterThan(0);
        expect(record.script.size).toBeGreaterThan(0);
        expect(record.script.source.length).toBeGreaterThan(0);

        expect(record.style.size).toBe(0);
        expect(record.style.sources.length).toBe(0);
        done();
      });
    });

    it("should record result of the component with multiple style sections (TestComponentWithMultipleStyles.vue)", (done) => {
      webpack(webpackOption(plugin)).run((err, stats) => {
        const record = recordFor("TestComponentWithMultipleStyles.vue");
        expect(record.template.size).toBeGreaterThan(0);
        expect(record.template.source.length).toBeGreaterThan(0);
        expect(record.script.size).toBeGreaterThan(0);
        expect(record.script.source.length).toBeGreaterThan(0);
        expect(record.style.size).toBeGreaterThan(0);

        expect(record.style.sources.length).toBe(4);
        done();
      });
    });
  });

  describe("stats file", () => {
    it("should dump as default", (done) => {
      const plugin = new Plugin();

      expect(fileExists(defaultStatsPath)).toBeFalsy();
      webpack(webpackOption(plugin)).run((err, stats) => {
        expect(fileExists(defaultStatsPath)).toBeTruthy();
        done();
      });
    });

    it("should dump stats as JSON", (done) => {
      const plugin = new Plugin();

      webpack(webpackOption(plugin)).run((err, stats) => {
        const content = fs.readFileSync(defaultStatsPath, "utf8");
        expect(plugin.records).toEqual(JSON.parse(content));
        done();
      });
    });

    it("should dump with given filepath", (done) => {
      const plugin = new Plugin({
        statsFilename: customPath
      });

      expect(fileExists(customPath)).toBeFalsy();
      webpack(webpackOption(plugin)).run((err, stats) => {
        expect(fileExists(customPath)).toBeTruthy();
        done();
      });
    });

    it("should not dump if given false", (done) => {
      const plugin = new Plugin({
        statsFilename: false
      });

      expect(fileExists(defaultStatsPath)).toBeFalsy();
      webpack(webpackOption(plugin)).run((err, stats) => {
        expect(fileExists(defaultStatsPath)).toBeFalsy();
        done();
      });
    });
  });
});
