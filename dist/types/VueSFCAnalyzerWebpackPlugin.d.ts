/// <reference types="webpack" />
import { Compiler } from "webpack";
export interface VueSFCAnalyzerRecord {
    template: {
        size: number;
        source: string;
    };
    script: {
        size: number;
        source: string;
    };
    style: {
        size: number;
        sources: string[];
    };
}
export interface VueSFCAnalyzerRecords {
    [filePath: string]: VueSFCAnalyzerRecord;
}
export interface VueSFCAnalyzerWebpackPluginOption {
    showSummary?: boolean;
    statsFilename?: false | string;
}
declare class VueSFCAnalyzerWebpackPlugin {
    records: VueSFCAnalyzerRecords;
    opts: VueSFCAnalyzerWebpackPluginOption;
    constructor(opts?: VueSFCAnalyzerWebpackPluginOption);
    apply(compiler: Compiler): void;
    private recordSFCStats(module);
    private constructRecord(filePath);
    private storeSource(filePath, source, section);
}
export default VueSFCAnalyzerWebpackPlugin;
