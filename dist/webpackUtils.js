"use strict";
// ***********************
// * Libraries & Plugins *
// ***********************
Object.defineProperty(exports, "__esModule", { value: true });
// *************
// * Constants *
// *************
var VUE_FILE_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?.*$/;
var VUE_FILE_TEMPLATE_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=template.*$/;
var VUE_FILE_SCRIPT_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=script.*$/;
var VUE_FILE_STYLE_REGEX = /.*vue-loader-options!([\w\-_/]+\.vue)\?vue&type=style.*$/;
exports.sectionByPortableId = function (module) {
    var portableId = module.request;
    if (portableId === undefined) {
        return;
    }
    var filename = exports.vueFilePathByPortableId(portableId);
    if (filename) {
        if (portableId.match(VUE_FILE_TEMPLATE_REGEX)) {
            return "template";
        }
        else if (portableId.match(VUE_FILE_SCRIPT_REGEX)) {
            return "script";
        }
        else if (portableId.match(VUE_FILE_STYLE_REGEX)) {
            return "style";
        }
    }
};
exports.vueFilePathByPortableId = function (portableId) {
    var matched = portableId.match(VUE_FILE_REGEX);
    return matched && matched[1];
};
//# sourceMappingURL=webpackUtils.js.map