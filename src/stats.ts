import * as fs from 'fs';
import * as path from 'path';
import * as mkdir from "mkdirp";
import chalk from "chalk";
const winston = require('winston');

import { VueSFCAnalyzerRecords } from "./VueSFCAnalyzerWebpackPlugin";

export const dump = (filePath: string, records: VueSFCAnalyzerRecords) => {
  mkdir.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(records));
  winston.info(chalk.bold(`WebpackVueSFCAnalyzerPlugin saved stats file to ${filePath}`));
};

export const show = (records: VueSFCAnalyzerRecords) => {
  const whole = {
    template: 0,
    script: 0,
    style: 0
  };
  Object.keys(records).forEach((filePath) => {
    const templateSize = records[filePath].template.size;
    const scriptSize = records[filePath].script.size;
    const styleSize = records[filePath].style.size;
    const total = templateSize + scriptSize + styleSize;
    whole.template += templateSize;
    whole.script += scriptSize;
    whole.style += styleSize;

    winston.info(chalk.underline(chalk.green(`[Compiled] ${filePath}:`)));
    winston.info(`  ${chalk.redBright("<template>")}: ${templateSize} bytes (${Math.round(templateSize / total * 100)}%)`);
    winston.info(`  ${chalk.blueBright("<script>")}  : ${scriptSize} bytes (${Math.round(scriptSize / total * 100)}%)`);
    winston.info(`  ${chalk.magentaBright("<style>")}   : ${styleSize} bytes (${Math.round(styleSize / total * 100)}%)`);
  });
  const wholeTotal = whole.template + whole.script + whole.style;
  winston.info(chalk.underline("Total all of .vue file:"));
  winston.info(`  ${chalk.redBright("<template>")}: ${whole.template} bytes (${Math.round(whole.template / wholeTotal * 100)}%)`);
  winston.info(`  ${chalk.blueBright("<script>")}  : ${whole.script} bytes (${Math.round(whole.template / wholeTotal * 100)}%)`);
  winston.info(`  ${chalk.magentaBright("<style>")}   : ${whole.style} bytes (${Math.round(whole.style / wholeTotal * 100)}%)`);
};
