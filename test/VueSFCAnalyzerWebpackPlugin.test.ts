import Plugin, { VueSFCAnalyzerWebpackPluginOption } from "../src/VueSFCAnalyzerWebpackPlugin";
import webpack from "webpack";
import path from "path";

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

  it("records", (done) => {
    const plugin = new Plugin({
      statsFilename: false
    });
    webpack(webpackOption(plugin)).run((err, stats) => {
      const record = plugin.records["test/fixtures/TestComponent.vue"];
      expect(record.template.size).toBeGreaterThan(0);
      expect(record.template.source.length).toBeGreaterThan(0);
      expect(record.script.size).toBeGreaterThan(0);
      expect(record.script.source.length).toBeGreaterThan(0);
      expect(record.style.size).toBeGreaterThan(0);
      expect(record.style.sources.length).toBe(2);
      done();
    });
  });
});
