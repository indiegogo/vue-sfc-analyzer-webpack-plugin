import { sectionByPortableId, vueFilePathByPortableId } from "../src/webpackUtils";

describe("webpackUtils", () => {
  describe("sectionByPortableId", () => {
    it("determines <script>", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/vue-loader/lib/selector.js?type=script&index=0!test/fixtures/TestComponentJS.vue"
      });
      expect(result).toEqual("script");
    });

    it("determines <script lang='ts'>", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/ts-loader/index.js!node_modules/vue-loader/lib/selector.js?type=script&index=0!test/fixtures/TestComponent.vue"
      });
      expect(result).toEqual("script");
    });

    it("determines <style> by vue-style-loader", () => {
      const result = sectionByPortableId({
        portableId: 'node_modules/vue-style-loader/index.js!node_modules/css-loader/index.js!node_modules/vue-loader/lib/style-compiler/index.js?{"optionsId":"0","vue":true,"id":"data-v-f14a96a4","scoped":true,"sourceMap":false}!node_modules/vue-loader/lib/selector.js?type=styles&index=0!test/fixtures/TestComponentJS.vue'
      });
      expect(result).toEqual("style");
    });

    it("determines <style> by css-loader", () => {
      const result = sectionByPortableId({
        portableId: 'node_modules/css-loader/index.js!node_modules/vue-loader/lib/style-compiler/index.js?{"optionsId":"0","vue":true,"id":"data-v-f14a96a4","scoped":true,"sourceMap":false}!node_modules/vue-loader/lib/selector.js?type=styles&index=0!test/fixtures/TestComponentJS.vue'
      });
      expect(result).toEqual("style");
    });

    it("determines <template>", () => {
      const result = sectionByPortableId({
        portableId: 'node_modules/vue-loader/lib/template-compiler/index.js?{"id":"data-v-894531b6","hasScoped":true,"optionsId":"0","buble":{"transforms":{}}}!node_modules/vue-loader/lib/selector.js?type=template&index=0!test/fixtures/TestComponent.vue'
      });
      expect(result).toEqual("template");
    });

    it("doesn't return section name if unknown loader is opening .vue file", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/unknown-loader/lib/selector.js?type=template&index=0!./EmailSignup.vue"
      });
      expect(result).toBeUndefined();
    });

    it("doesn't return section name if the module is by top-level of vue-loader", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/vue-loader/index.js!test/fixtures/TestComponentWithMultipleStyles.vue"
      });
      expect(result).toBeUndefined();
    });
  });

  describe("vueFilePathByPortable", () => {
    it("returns file path for .vue file", () => {
      const result = vueFilePathByPortableId("node_modules/unknown-loader/dist/index.js!node_modules/vue-loader/lib/selector.js?type=template&index=0!./fixtures/somewhere/EmailSignup.vue")
      expect(result).toEqual("/fixtures/somewhere/EmailSignup.vue");
    });

    it("return null portableId is not for .vue file", () => {
      const result = vueFilePathByPortableId("node_modules/unknown-loader/dist/index.js!node_modules/vue-loader/lib/selector.js?type=template&index=0!./fixtures/somewhere/EmailSignup.ts")
      expect(result).toBeNull();
    });
  });
});
