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
var path = require("path");
var winston = require('winston');
var webpackUtils_1 = require("./webpackUtils");
var stats_1 = require("./stats");
winston.configure({
    level: process.env.NODE_ENV === "test" ? "warning" : "info",
    transports: [
        new winston.transports.Console({
            colorize: true,
            showLevel: false
        })
    ]
});
var VueSFCAnalyzerWebpackPlugin = /** @class */ (function () {
    function VueSFCAnalyzerWebpackPlugin(opts) {
        if (opts === void 0) { opts = {}; }
        this.records = {};
        this.opts = __assign({ showSummary: false, statsFilename: path.resolve(process.cwd(), "./vue_sfc_stats.json") }, opts);
    }
    VueSFCAnalyzerWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        winston.info("WebpackVueSFCAnalyzerPlugin is Enabled");
        compiler.plugin("emit", function (compilation, callback) {
            compilation.chunks.forEach(function (chunk) {
                chunk.forEachModule(_this.recordSFCStats.bind(_this));
            });
            callback();
        });
        compiler.plugin("done", function () {
            if (_this.opts.showSummary) {
                stats_1.total(_this.records);
                stats_1.show(_this.records);
            }
            if (_this.opts.statsFilename) {
                stats_1.dump(_this.opts.statsFilename, _this.records);
            }
        });
    };
    VueSFCAnalyzerWebpackPlugin.prototype.recordSFCStats = function (module) {
        var section = webpackUtils_1.sectionByPortableId(module);
        if (section) {
            var filePath = webpackUtils_1.vueFilePathByPortableId(module.portableId);
            this.constructRecord(filePath);
            this.storeSource(filePath, module._source._value, section);
        }
    };
    VueSFCAnalyzerWebpackPlugin.prototype.constructRecord = function (filePath) {
        if (!!this.records[filePath])
            return;
        var source = "";
        var size = 0;
        this.records[filePath] = {
            template: { source: source, size: size },
            script: { source: source, size: size },
            style: { sources: [], size: size }
        };
    };
    VueSFCAnalyzerWebpackPlugin.prototype.storeSource = function (filePath, source, section) {
        var size = Buffer.byteLength(source, "utf8");
        if (section === "style") {
            this.records[filePath][section].sources.push(source);
            this.records[filePath][section].size += size;
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
//# sourceMappingURL=VueSFCAnalyzerWebpackPlugin.js.map