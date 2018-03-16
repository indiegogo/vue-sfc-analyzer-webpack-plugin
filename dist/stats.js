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
    var whole = {
        template: 0,
        script: 0,
        style: 0
    };
    Object.keys(records).forEach(function (filePath) {
        var templateSize = records[filePath].template.size;
        var scriptSize = records[filePath].script.size;
        var styleSize = records[filePath].style.size;
        var total = templateSize + scriptSize + styleSize;
        whole.template += templateSize;
        whole.script += scriptSize;
        whole.style += styleSize;
        winston.info(chalk_1.default.underline(chalk_1.default.green("[Compiled] " + filePath + ":")));
        winston.info("  " + chalk_1.default.redBright("<template>") + ": " + templateSize + " bytes (" + Math.round(templateSize / total * 100) + "%)");
        winston.info("  " + chalk_1.default.blueBright("<script>") + "  : " + scriptSize + " bytes (" + Math.round(scriptSize / total * 100) + "%)");
        winston.info("  " + chalk_1.default.magentaBright("<style>") + "   : " + styleSize + " bytes (" + Math.round(styleSize / total * 100) + "%)");
    });
    var wholeTotal = whole.template + whole.script + whole.style;
    winston.info(chalk_1.default.underline("Total all of .vue file:"));
    winston.info("  " + chalk_1.default.redBright("<template>") + ": " + whole.template + " bytes (" + Math.round(whole.template / wholeTotal * 100) + "%)");
    winston.info("  " + chalk_1.default.blueBright("<script>") + "  : " + whole.script + " bytes (" + Math.round(whole.template / wholeTotal * 100) + "%)");
    winston.info("  " + chalk_1.default.magentaBright("<style>") + "   : " + whole.style + " bytes (" + Math.round(whole.style / wholeTotal * 100) + "%)");
};
//# sourceMappingURL=stats.js.map