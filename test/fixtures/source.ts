import Vue from "vue";
import TestComponent from "./TestComponent.vue";
import TestComponentJS from "./TestComponentJS.vue";
import TestComponentWithoutStyle from "./TestComponentWithoutStyle.vue";
import TestComponentWithMultipleStyles from "./TestComponentWithMultipleStyles.vue";

const app = new Vue({
  render: createElement => createElement(TestComponent),
  components: { TestComponentWithoutStyle, TestComponentWithMultipleStyles, TestComponentJS }
}).$mount("#mountPoint");
