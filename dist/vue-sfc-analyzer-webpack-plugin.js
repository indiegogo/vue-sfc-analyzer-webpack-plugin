"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var path = require("path");
var fs = require("fs");
var mkdir = require("mkdirp");
var SECTION_TEMPLATE = "template";
var SECTION_SCRIPT = "script";
var SECTION_STYLE = "style";
var VueSFCAnalyzerWebpackPlugin = /** @class */ (function () {
    function VueSFCAnalyzerWebpackPlugin(opts) {
        if (opts === void 0) { opts = {}; }
        this.records = {};
        this.opts = __assign({ showSummary: false, statsFilename: path.resolve(process.cwd(), "./vue_sfc_stats.json") }, opts);
    }
    VueSFCAnalyzerWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        console.log("WebpackVueSFCAnalyzerPlugin is Enabled");
        compiler.plugin("emit", function (compilation, callback) {
            compilation.chunks.forEach(function (chunk) {
                chunk.forEachModule(function (module) {
                    var portableId = module.portableId;
                    var vueFile = portableId.match(/([\w\-/]+\.vue)$/);
                    if (vueFile) {
                        var filePath = vueFile[1];
                        _this.constructRecord(filePath);
                        var section = _this.getSectionByPortableId(portableId);
                        if (section) {
                            _this.storeSource(filePath, module._source._value, section);
                        }
                    }
                });
            });
            callback();
        });
        compiler.plugin("done", function () {
            if (_this.opts.showSummary) {
                var whole_1 = (_a = {},
                    _a[SECTION_TEMPLATE] = 0,
                    _a[SECTION_SCRIPT] = 0,
                    _a[SECTION_STYLE] = 0,
                    _a);
                Object.keys(_this.records).forEach(function (filePath) {
                    var templateSize = _this.records[filePath][SECTION_TEMPLATE].size;
                    var scriptSize = _this.records[filePath][SECTION_SCRIPT].size;
                    var styleSize = _this.records[filePath][SECTION_STYLE].size;
                    var total = templateSize + scriptSize + styleSize;
                    whole_1[SECTION_TEMPLATE] += templateSize;
                    whole_1[SECTION_SCRIPT] += scriptSize;
                    whole_1[SECTION_STYLE] += styleSize;
                    console.log(chalk_1.default.underline(chalk_1.default.green("[Compiled] " + filePath + ":")));
                    console.log("  " + chalk_1.default.redBright("<template>") + ": " + templateSize + " bytes (" + Math.round(templateSize / total * 100) + "%)");
                    console.log("  " + chalk_1.default.blueBright("<script>") + "  : " + scriptSize + " bytes (" + Math.round(scriptSize / total * 100) + "%)");
                    console.log("  " + chalk_1.default.magentaBright("<style>") + "   : " + styleSize + " bytes (" + Math.round(styleSize / total * 100) + "%)");
                });
                var wholeTotal = whole_1[SECTION_TEMPLATE] + whole_1[SECTION_SCRIPT] + whole_1[SECTION_STYLE];
                console.log(chalk_1.default.underline("Total all of .vue file:"));
                console.log("  " + chalk_1.default.redBright("<template>") + ": " + whole_1[SECTION_TEMPLATE] + " bytes (" + Math.round(whole_1[SECTION_TEMPLATE] / wholeTotal * 100) + "%)");
                console.log("  " + chalk_1.default.blueBright("<script>") + "  : " + whole_1[SECTION_SCRIPT] + " bytes (" + Math.round(whole_1[SECTION_SCRIPT] / wholeTotal * 100) + "%)");
                console.log("  " + chalk_1.default.magentaBright("<style>") + "   : " + whole_1[SECTION_STYLE] + " bytes (" + Math.round(whole_1[SECTION_STYLE] / wholeTotal * 100) + "%)");
            }
            if (_this.opts.statsFilename) {
                mkdir.sync(path.dirname(_this.opts.statsFilename));
                fs.writeFileSync(_this.opts.statsFilename, JSON.stringify(_this.records));
                console.log(chalk_1.default.bold("WebpackVueSFCAnalyzerPlugin saved stats file to " + _this.opts.statsFilename));
            }
            var _a;
        });
    };
    VueSFCAnalyzerWebpackPlugin.prototype.constructRecord = function (filePath) {
        if (!!this.records[filePath])
            return;
        var source = "";
        var size = 0;
        this.records[filePath] = (_a = {},
            _a[SECTION_TEMPLATE] = { source: source, size: size },
            _a[SECTION_SCRIPT] = { source: source, size: size },
            _a[SECTION_STYLE] = { sources: [], size: size },
            _a);
        var _a;
    };
    VueSFCAnalyzerWebpackPlugin.prototype.getSectionByPortableId = function (portableId) {
        // Should parse loader ideally, and not support pure JS of <script> yet
        if (portableId.match(/^node_modules\/vue-loader\/lib\/template-compiler\//)) {
            return SECTION_TEMPLATE;
        }
        else if (portableId.match(/^node_modules\/ts-loader\/index\.js/)) {
            return SECTION_SCRIPT;
        }
        else if (portableId.match(/^node_modules\/vue-style-loader\/index\.js/) ||
            portableId.match(/^node_modules\/css-loader\/index\.js/)) {
            return SECTION_STYLE;
        }
    };
    VueSFCAnalyzerWebpackPlugin.prototype.storeSource = function (filePath, source, section) {
        var size = Buffer.byteLength(source, "utf8");
        if (section === SECTION_STYLE) {
            this.records[filePath][section].sources.push(source);
            this.records[filePath][section].size = size;
        }
        else {
            this.records[filePath][section] = { source: source, size: size };
        }
    };
    return VueSFCAnalyzerWebpackPlugin;
}());
exports.default = VueSFCAnalyzerWebpackPlugin;
module.exports = VueSFCAnalyzerWebpackPlugin; //CJS
module.exports.default = module.exports; // ES6
//# sourceMappingURL=vue-sfc-analyzer-webpack-plugin.js.map