import { VueSFCAnalyzerRecord } from "./VueSFCAnalyzerWebpackPlugin";

export const sectionByPortableId = (module: any): keyof VueSFCAnalyzerRecord | void => {
  const { portableId } = module;
  if (vueFilePathByPortableId(portableId)) {
    // Should parse loader ideally, and not support pure JS of <script> yet
    if (portableId.match(/\/vue-loader\/lib\/selector\.js\?type=template&index=\d!([\w\-_/\.]+\.vue)$/)) {
      return "template";
    } else if (
      portableId.match(/\/vue-loader\/lib\/selector\.js\?type=script&index=\d!([\w\-_/\.]+\.vue)$/)
    ) {
      return "script";
    } else if (
      portableId.match(/\/vue-loader\/lib\/selector\.js\?type=styles&index=\d!([\w\-_/\.]+\.vue)$/)
    ) {
      return "style";
    }
  }
}

export const vueFilePathByPortableId = (portableId: string): string | null => {
  const matched = portableId.match(/([\w\-_/]+\.vue)$/);
  return matched && matched[1];
}
