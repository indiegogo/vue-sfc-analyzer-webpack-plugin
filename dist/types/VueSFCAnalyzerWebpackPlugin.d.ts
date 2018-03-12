/// <reference types="webpack" />
import { Compiler } from "webpack";
export interface VueSFCAnalyzerWebpackPluginOption {
    showSummary?: boolean;
    statsFilename?: false | string;
}
declare class VueSFCAnalyzerWebpackPlugin {
    private records;
    private opts;
    constructor(opts?: VueSFCAnalyzerWebpackPluginOption);
    apply(compiler: Compiler): void;
    private constructRecord(filePath);
    private getSectionByPortableId(portableId);
    private storeSource(filePath, source, section);
}
export default VueSFCAnalyzerWebpackPlugin;
