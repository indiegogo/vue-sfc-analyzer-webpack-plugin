import Vue from "vue";
import TestComponent from "./TestComponent.vue";
import TestComponentWithoutStyle from "./TestComponentWithoutStyle.vue";
import TestComponentWithMultipleStyles from "./TestComponentWithMultipleStyles.vue";

const app = new Vue({
  render: createElement => createElement(TestComponent),
  components: { TestComponentWithoutStyle, TestComponentWithMultipleStyles }
}).$mount("#mountPoint");
