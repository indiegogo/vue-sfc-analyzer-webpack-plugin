import { sectionByPortableId, vueFilePathByPortableId } from "../src/webpackUtils";

describe("webpackUtils", () => {
  describe("sectionByPortableId", () => {
    it("determines <script>", () => {
      const result = sectionByPortableId({
        request: "node_modules/vue-loader/lib/index.js??vue-loader-options!test/fixtures/TestComponentJS.vue?vue&type=script&id=d235d5ce"
      });
      expect(result).toEqual("script");
    });

    it("determines <script lang='ts'>", () => {
      const result = sectionByPortableId({
        request: "node_modules/vue-loader/lib/index.js??vue-loader-options!test/fixtures/TestComponent.vue?vue&type=script&id=d235d5ce"
      });
      expect(result).toEqual("script");
    });

    it("determines <style> by vue-style-loader", () => {
      const result = sectionByPortableId({
        request: 'node_modules/vue-loader/lib/index.js??vue-loader-options!test/fixtures/TestComponentJS.vue?vue&type=style&index=0&id=2e494b62&scoped=true&lang=css'
      });
      expect(result).toEqual("style");
    });

    it("determines <style> by css-loader", () => {
      const result = sectionByPortableId({
        request: 'node_modules/vue-loader/lib/index.js??vue-loader-options!test/fixtures/TestComponentJS.vue?vue&type=style&index=0&id=2e494b62&scoped=true&lang=css'
      });
      expect(result).toEqual("style");
    });

    it("determines <template>", () => {
      const result = sectionByPortableId({
        request: 'node_modules/vue-loader/lib/index.js??vue-loader-options!test/fixtures/TestComponentJS.vue?vue&type=template&index=0&id=2e494b62'
      });
      expect(result).toEqual("template");
    });

    it("doesn't return section name if unknown loader is opening .vue file", () => {
      const result = sectionByPortableId({
        request: "node_modules/unknown-loader/lib/selector.js?type=template&index=0!./EmailSignup.vue"
      });
      expect(result).toBeUndefined();
    });

    it("doesn't return section name if the module is by top-level of vue-loader", () => {
      const result = sectionByPortableId({
        request: "node_modules/vue-loader/index.js!test/fixtures/TestComponentWithMultipleStyles.vue"
      });
      expect(result).toBeUndefined();
    });
  });

  describe("vueFilePathByPortable", () => {
    it("returns file path for .vue file", () => {
      const result = vueFilePathByPortableId("node_modules/unknown-loader/dist/index.js!node_modules/vue-loader/lib/index.js??vue-loader-options!/fixtures/somewhere/EmailSignup.vue?vue&type=template&index=0&id=2e494b62")
      expect(result).toEqual("/fixtures/somewhere/EmailSignup.vue");
    });

    it("return null portableId is not for .vue file", () => {
      const result = vueFilePathByPortableId("node_modules/unknown-loader/dist/index.js!node_modules/vue-loader/lib/index.js??vue-loader-options!test/fixtures/somewhere/EmailSignup.ts?vue&type=template&index=0&id=2e494b62")
      expect(result).toBeNull();
    });
  });
});
