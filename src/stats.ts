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
  Object.keys(records).forEach((filePath) => {
    const templateSize = records[filePath].template.size;
    const scriptSize = records[filePath].script.size;
    const styleSize = records[filePath].style.size;
    winston.info(chalk.underline(chalk.green(`[Compiled] ${filePath}:`)));
    presentEachSection({ template: templateSize, script: scriptSize, style: styleSize });
  });
};

export const total = (records: VueSFCAnalyzerRecords) => {
  const whole = {
    template: 0,
    script: 0,
    style: 0
  };
  Object.keys(records).forEach((filePath) => {
    whole.template += records[filePath].template.size;
    whole.script += records[filePath].script.size;
    whole.style += records[filePath].style.size;
  });
  winston.info(chalk.underline("Total all of .vue file:"));
  presentEachSection(whole);
}

const presentEachSection = (analysis: { template: number, script: number, style: number }) => {
  const total = analysis.template + analysis.script + analysis.style;
  winston.info(`  ${chalk.redBright("<template>")}: ${analysis.template} bytes (${Math.round(analysis.template / total * 100 * 10) / 10}%)`);
  winston.info(`  ${chalk.blueBright("<script>")}  : ${analysis.script} bytes (${Math.round(analysis.script / total * 100 * 10) / 10}%)`);
  winston.info(`  ${chalk.magentaBright("<style>")}   : ${analysis.style} bytes (${Math.round(analysis.style / total * 100 * 10) / 10}%)`);
};
