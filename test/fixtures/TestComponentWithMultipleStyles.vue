<template>
  <div class="webpackVueSFCAnalyzerPlugin">
    {{ welcome }}
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default class TestComponentWithMultipleStyles extends Vue {
    data () {
      return {
        welcome: "hello with multiple styles"
      };
    }
  }
</script>

<style>
  body {
    font-size: 15px;
  }
</style>

<style scoped>
  .webpackVueSFCAnalyzerPlugin {
    font-size: 12px;
  }
</style>
