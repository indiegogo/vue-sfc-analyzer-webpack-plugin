import Vue from "vue";
import TestComponent from "./TestComponent.vue";

const app = new Vue({
  render: createElement => createElement(TestComponent)
}).$mount("#mountPoint");
