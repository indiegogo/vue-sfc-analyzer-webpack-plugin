"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var mkdir = require("mkdirp");
var chalk_1 = require("chalk");
var winston = require('winston');
exports.dump = function (filePath, records) {
    mkdir.sync(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(records));
    winston.info(chalk_1.default.bold("WebpackVueSFCAnalyzerPlugin saved stats file to " + filePath));
};
exports.show = function (records) {
    Object.keys(records).forEach(function (filePath) {
        var templateSize = records[filePath].template.size;
        var scriptSize = records[filePath].script.size;
        var styleSize = records[filePath].style.size;
        winston.info(chalk_1.default.underline(chalk_1.default.green("[Compiled] " + filePath + ":")));
        presentEachSection({ template: templateSize, script: scriptSize, style: styleSize });
    });
};
exports.total = function (records) {
    var whole = {
        template: 0,
        script: 0,
        style: 0
    };
    Object.keys(records).forEach(function (filePath) {
        whole.template += records[filePath].template.size;
        whole.script += records[filePath].script.size;
        whole.style += records[filePath].style.size;
    });
    winston.info(chalk_1.default.underline("Total all of .vue file:"));
    presentEachSection(whole);
};
var presentEachSection = function (analysis) {
    var total = analysis.template + analysis.script + analysis.style;
    winston.info("  " + chalk_1.default.redBright("<template>") + ": " + analysis.template + " bytes (" + Math.round(analysis.template / total * 100 * 10) / 10 + "%)");
    winston.info("  " + chalk_1.default.blueBright("<script>") + "  : " + analysis.script + " bytes (" + Math.round(analysis.script / total * 100 * 10) / 10 + "%)");
    winston.info("  " + chalk_1.default.magentaBright("<style>") + "   : " + analysis.style + " bytes (" + Math.round(analysis.style / total * 100 * 10) / 10 + "%)");
};
//# sourceMappingURL=stats.js.map