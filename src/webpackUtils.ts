import { VueSFCAnalyzerRecord } from "./VueSFCAnalyzerWebpackPlugin";

export const sectionByPortableId = (module: any): keyof VueSFCAnalyzerRecord | void => {
  const portableId = module.request;
  if(portableId === undefined) {
    return
  }
  const filename = vueFilePathByPortableId(portableId);
  if (filename) {
    if (portableId.match(/.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=template.*$/)) {
      return "template";
    } else if (portableId.match(/.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=script.*$/)) {
      return "script";
    } else if (portableId.match(/.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=style.*$/)) {
      return "style";
    }
  }
}

export const vueFilePathByPortableId = (portableId: string): string | null => {
  const matched = portableId.match(/.*vue-loader-options!([\w\-_/]+\.vue)\?.*$/);
  return matched && matched[1];
}
