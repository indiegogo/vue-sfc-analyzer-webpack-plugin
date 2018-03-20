import { dump, show, total } from "../src/stats";
import fs from "fs";
import winston from "winston";

const mockFs = jest.genMockFromModule("fs");
mockFs["writeFileSync"] = jest.fn();
jest.mock("fs");

describe("stats", () => {
  const sampleRecords = {
    "fixtures/TestComponent.vue": {
      template: {
        size: 507,
        source: 'var render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c("div", { staticClass: "webpackVueSFCAnalyzerPlugin" }, [\n    _vm._v("\\n  " + _vm._s(_vm.welcome) + "\\n")\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\nexport { render, staticRenderFns }\nif (module.hot) {\n  module.hot.accept()\n  if (module.hot.data) {\n    require("vue-hot-reload-api")      .rerender("data-v-894531b6", { render: render, staticRenderFns: staticRenderFns })\n  }\n}'
      },
      script: {
        size: 897,
        source: 'var __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nimport Vue from "vue";\nvar TestComponent = /** @class */ (function (_super) {\n    __extends(TestComponent, _super);\n    function TestComponent() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    TestComponent.prototype.data = function () {\n        return {\n            welcome: "hello"\n        };\n    };\n    return TestComponent;\n}(Vue));\nexport default TestComponent;\n'
      },
      style: {
        size: 1900,
        sources: [
          '// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\\"optionsId\\":\\"0\\",\\"vue\\":true,\\"id\\":\\"data-v-894531b6\\",\\"scoped\\":true,\\"sourceMap\\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TestComponent.vue");\nif(typeof content === \'string\') content = [[module.id, content, \'\']];\nif(content.locals) module.exports = content.locals;\n// add the styles to the DOM\nvar add = require("!../../node_modules/vue-style-loader/lib/addStylesClient.js").default\nvar update = add("4a3683ab", content, false, {});\n// Hot Module Replacement\nif(module.hot) {\n // When the styles change, update the <style> tags\n if(!content.locals) {\n   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\\"optionsId\\":\\"0\\",\\"vue\\":true,\\"id\\":\\"data-v-894531b6\\",\\"scoped\\":true,\\"sourceMap\\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TestComponent.vue", function() {\n     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\\"optionsId\\":\\"0\\",\\"vue\\":true,\\"id\\":\\"data-v-894531b6\\",\\"scoped\\":true,\\"sourceMap\\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./TestComponent.vue");\n     if(typeof newContent === \'string\') newContent = [[module.id, newContent, \'\']];\n     update(newContent);\n   });\n }\n // When the module is disposed, remove the <style> tags\n module.hot.dispose(function() { update(); });\n}',
          'exports = module.exports = require("../../node_modules/css-loader/lib/css-base.js")(false);\n// imports\n\n\n// module\nexports.push([module.id, "\\n.webpackVueSFCAnalyzerPlugin[data-v-894531b6] {\\n  font-size: 12px;\\n}\\n", ""]);\n\n// exports\n'
        ]
      }
    },
    "fixtures/TestComponentWithoutStyle.vue": {
      template: {
        size: 519,
        source: 'var render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c("div", { staticClass: "webpackVueSFCAnalyzerPluginWithoutStyle" }, [\n    _vm._v("\\n  " + _vm._s(_vm.welcome) + "\\n")\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\nexport { render, staticRenderFns }\nif (module.hot) {\n  module.hot.accept()\n  if (module.hot.data) {\n    require("vue-hot-reload-api")      .rerender("data-v-391d9d0e", { render: render, staticRenderFns: staticRenderFns })\n  }\n}'
      },
      script: {
        size: 983,
        source: 'var __extends = (this && this.__extends) || (function () {\n    var extendStatics = Object.setPrototypeOf ||\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nimport Vue from "vue";\nvar TestComponentWithoutStyle = /** @class */ (function (_super) {\n    __extends(TestComponentWithoutStyle, _super);\n    function TestComponentWithoutStyle() {\n        return _super !== null && _super.apply(this, arguments) || this;\n    }\n    TestComponentWithoutStyle.prototype.data = function () {\n        return {\n            welcome: "hello without style"\n        };\n    };\n    return TestComponentWithoutStyle;\n}(Vue));\nexport default TestComponentWithoutStyle;\n'
      },
      style: {
        size: 0,
        sources: []
      }
    }
  };

  describe("dump", () => {
    it("writes file", () => {
      dump("somewhere.json", sampleRecords);
      expect(fs.writeFileSync).toBeCalledWith("somewhere.json", JSON.stringify(sampleRecords));
    });

    it("tells about the file written", () => {
      const logger = jest.fn();
      winston.info = logger;
      dump("somewhere.json", sampleRecords);
      expect(logger.mock.calls[0][0]).toContain("WebpackVueSFCAnalyzerPlugin saved stats file to somewhere.json");
    });
  });

  describe("show", () => {
    it("shows summary", () => {
      const logger = jest.fn();
      winston.info = logger;
      show(sampleRecords);
      expect(logger.mock.calls[0][0]).toContain("[Compiled] fixtures/TestComponent.vue");
      expect(logger.mock.calls[1][0]).toContain("<template>");
      expect(logger.mock.calls[1][0]).toContain("507 bytes ");
      expect(logger.mock.calls[1][0]).toContain("15.3%");
      expect(logger.mock.calls[2][0]).toContain("<script>");
      expect(logger.mock.calls[2][0]).toContain("897 bytes ");
      expect(logger.mock.calls[2][0]).toContain("27.1%");
      expect(logger.mock.calls[3][0]).toContain("<style>");
      expect(logger.mock.calls[3][0]).toContain("1900 bytes ");
      expect(logger.mock.calls[3][0]).toContain("57.5%");

      expect(logger.mock.calls[4][0]).toContain("[Compiled] fixtures/TestComponentWithoutStyle.vue");
      expect(logger.mock.calls[5][0]).toContain("<template>");
      expect(logger.mock.calls[5][0]).toContain("519 bytes ");
      expect(logger.mock.calls[5][0]).toContain("34.6%");
      expect(logger.mock.calls[6][0]).toContain("<script>");
      expect(logger.mock.calls[6][0]).toContain("983 bytes ");
      expect(logger.mock.calls[6][0]).toContain("65.4%");
      expect(logger.mock.calls[7][0]).toContain("<style>");
      expect(logger.mock.calls[7][0]).toContain("0 bytes ");
      expect(logger.mock.calls[7][0]).toContain("0%");
    });
  });

  describe("total", () => {
    it("shows total values", () => {
      const logger = jest.fn();
      winston.info = logger;
      total(sampleRecords);

      expect(logger.mock.calls[0][0]).toContain("Total all of .vue file:");
      expect(logger.mock.calls[1][0]).toContain("<template>");
      expect(logger.mock.calls[1][0]).toContain("1026 bytes ");
      expect(logger.mock.calls[1][0]).toContain("21.3%");
      expect(logger.mock.calls[2][0]).toContain("<script>");
      expect(logger.mock.calls[2][0]).toContain("1880 bytes ");
      expect(logger.mock.calls[2][0]).toContain("39.1%");
      expect(logger.mock.calls[3][0]).toContain("<style>");
      expect(logger.mock.calls[3][0]).toContain("1900 bytes ");
      expect(logger.mock.calls[3][0]).toContain("39.5%");
    });
  });
});
