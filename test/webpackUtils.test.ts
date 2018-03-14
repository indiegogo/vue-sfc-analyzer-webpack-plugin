import { sectionByPortableId, vueFilePathByPortableId } from "../src/webpackUtils";

describe("webpackUtils", () => {
  describe("sectionByPortableId", () => {
    it("determines <script lang='ts'>", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/ts-loader/index.js!node_modules/vue-loader/lib/selector.js?type=script&index=0!./EmailSignup.vue"
      });
      expect(result).toEqual("script");
    });

    it("determines <style> by vue-style-loader", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/vue-style-loader/index.js!css-loader?minimize!../../../node_modules/vue-loader/lib/style-compiler/index?{\"vue\":true,\"id\":\"data-v-40ae7f6c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector?type=styles&index=0!./EmailSignup.vue"
      });
      expect(result).toEqual("style");
    });

    it("determines <style> by css-loader", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/css-loader/index.js?minimize!../../../node_modules/vue-loader/lib/style-compiler/index?{\"vue\":true,\"id\":\"data-v-40ae7f6c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector?type=styles&index=0!./EmailSignup.vue"
      });
      expect(result).toEqual("style");
    });

    it("determines <template>", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-40ae7f6c\",\"hasScoped\":true,\"buble\":{\"transforms\":{}}}!node_modules/vue-loader/lib/selector.js?type=template&index=0!./EmailSignup.vue"
      });
      expect(result).toEqual("template");
    });

    it("doesn't return section name if unknow loader is processing .vue file", () => {
      const result = sectionByPortableId({
        portableId: "node_modules/unknown-loader/dist/index.js!node_modules/vue-loader/lib/selector.js?type=template&index=0!./EmailSignup.vue"
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
