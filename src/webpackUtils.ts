// ***********************
// * Libraries & Plugins *
// ***********************

import { VueSFCAnalyzerRecord } from "./VueSFCAnalyzerWebpackPlugin";

// *************
// * Constants *
// *************

const VUE_FILE_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?.*$/
const VUE_FILE_TEMPLATE_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=template.*$/
const VUE_FILE_SCRIPT_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=script.*$/
const VUE_FILE_STYLE_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=style.*$/

export const sectionByPortableId = (module: any): keyof VueSFCAnalyzerRecord | void => {
  const portableId = module.request;
  if(portableId === undefined) {
    return
  }
  const filename = vueFilePathByPortableId(portableId);
  if (filename) {
    if (portableId.match(VUE_FILE_TEMPLATE_REGEX)) {
      return "template";
    } else if (portableId.match(VUE_FILE_SCRIPT_REGEX)) {
      return "script";
    } else if (portableId.match(VUE_FILE_STYLE_REGEX)) {
      return "style";
    }
  }
}

export const vueFilePathByPortableId = (portableId: string): string | null => {
  const matched = portableId.match(VUE_FILE_REGEX);
  return matched && matched[1];
}
