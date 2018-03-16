"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionByPortableId = function (module) {
    var portableId = module.portableId;
    if (exports.vueFilePathByPortableId(portableId)) {
        // Should parse loader ideally, and not support pure JS of <script> yet
        if (portableId.match(/\/vue-loader\/lib\/selector\.js\?type=template&index=\d!([\w\-_/\.]+\.vue)$/)) {
            return "template";
        }
        else if (portableId.match(/\/vue-loader\/lib\/selector\.js\?type=script&index=\d!([\w\-_/\.]+\.vue)$/)) {
            return "script";
        }
        else if (portableId.match(/\/vue-loader\/lib\/selector\.js\?type=styles&index=\d!([\w\-_/\.]+\.vue)$/)) {
            return "style";
        }
    }
};
exports.vueFilePathByPortableId = function (portableId) {
    var matched = portableId.match(/([\w\-_/]+\.vue)$/);
    return matched && matched[1];
};
//# sourceMappingURL=webpackUtils.js.map