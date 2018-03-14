import { VueSFCAnalyzerRecord } from "./VueSFCAnalyzerWebpackPlugin";

export const sectionByPortableId = (module: any): keyof VueSFCAnalyzerRecord | void => {
  const { portableId } = module;
  if (vueFilePathByPortableId(portableId)) {
    // Should parse loader ideally, and not support pure JS of <script> yet
    if (portableId.match(/^node_modules\/vue-loader\/lib\/template-compiler\//)) {
      return "template";
    } else if (portableId.match(/^node_modules\/ts-loader\/index\.js/)) {
      return "script";
    } else if (
      portableId.match(/^node_modules\/vue-style-loader\/index\.js/) ||
      portableId.match(/^node_modules\/css-loader\/index\.js/)
    ) {
      return "style";
    }
  }
}

export const vueFilePathByPortableId = (portableId: string): string | null => {
  const matched = portableId.match(/([\w\-_/]+\.vue)$/);
  return matched && matched[1];
}
